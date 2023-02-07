const taxBands = [{
    'bandlow': 0,
    'rate': 0
  },
  {
    'bandlow': 145001,
    'rate': 0.02
  },
  {
    'bandlow': 325001,
    'rate': 0.10
  },
  {
    'bandlow': 250001,
    'rate': 0.05
  },
  {
    'bandlow': 750001,
    'rate': 0.12
  }
];

function createFormDataObj(form) {
  const myFormData = {};
  myFormData.ads = form.ads.value;
  myFormData.linked = form.linked_transaction.value;
  myFormData.firstBuyer = form.buyer_relief.value;
  myFormData.price = Math.floor(form.purchase_price.value);
  myFormData.transactionDate = form.transaction_date.value;
  return myFormData;
};

// This function returns an object in which the amountTaxedInBand and the
// maxTaxInBand are calculated and stored in each band.
function createTaxBandObj(purchasePrice) {
  purchasePrice = filterTheInput(purchasePrice);
  let amountTaxedInBand = 0;
  let maxTaxedInBand = 0;

  let sortedtaxBands = taxBands.sort((a, b) => {
    return a.bandlow - b.bandlow;
  });

  for (let i = 0; i < sortedtaxBands.length; i++) {
    if (i < sortedtaxBands.length - 1) {
      sortedtaxBands[i].bandhigh = sortedtaxBands[i+1].bandlow - 1;
    } else {
      sortedtaxBands[i].bandhigh = Infinity;
    }
  }
  return sortedtaxBands.map(function(band) {
    maxTaxedInBand = band.bandhigh - band.bandlow;
    band.maxTaxedInBand = maxTaxedInBand;
    if (purchasePrice <= maxTaxedInBand) {
      amountTaxedInBand = purchasePrice;
    } else {
      amountTaxedInBand = band.bandhigh - band.bandlow;
    }
    amountTaxedInBand = amountTaxedInBand < 0 ? 0 : amountTaxedInBand;
    purchasePrice -= amountTaxedInBand;
    band.amountTaxedInBand = amountTaxedInBand;
    band.tax = Math.round(amountTaxedInBand * (band.rate));
    return band;
  });
};

// This function loops through objects, adds up the value of tax for each object
// and then returns the total.
function addTax(bands) {
  return bands.reduce(function(total, band) {
    total = typeof total === 'object' ? total.tax : total;
    return total + band.tax;
  });
};

// This function throws an error if it is passed 0 or NaN.
function notZero(n) {
  n = +n; // Coerce to number.
  if (n === 0 || isNaN(n)) { // Matches +0, -0, NaN
    throw new Error('Cannot divide by zero or other invalid dividend');
  }
  return n;
}

function filterTheInput(val) {
  // ignore everything but numbers in purchasePrice. if there are no numbers,
  // throw an error.
  if (typeof val === 'number') {
    return val;
  } else if (val.match(/\d+/g) === null) {
    return function() {
      throw Error("Input must be or contain a number")
    }();
  }
  return Math.round(
    parseInt(
      val.replace(/[^0-9]+/g, '').match(/\d+/g)
    )
  );
};

function createReturnObj(taxBands) {
  return {
    purchasePrice: 0,
    totalTax: 0,
    taxPercentage: 0,
    taxBands: taxBands
  };
};

// This function is the calling function for the tax calculator.
function lbttCalculator(purchasePrice) {
  purchasePrice = filterTheInput(purchasePrice);
  const taxBandObj = createTaxBandObj(purchasePrice);
  const returnObj = createReturnObj(taxBandObj);
  returnObj.totalTax = parseInt(addTax(returnObj.taxBands));
  returnObj.purchasePrice = purchasePrice;
  returnObj.taxPercentage = parseFloat(
    (returnObj.totalTax / notZero(purchasePrice) * 100).toFixed(2)
  );
  return returnObj;
};

function callingFunction(form) {
  const returnObj = lbttCalculator(form.number.value);
  document.getElementById("total_tax").innerHTML = returnObj.totalTax;
  document.getElementById("total_percentage").innerHTML = returnObj.taxPercentage;
}

document.getElementById("click_submit").addEventListener('click', event => {
  event.preventDefault();
  callingFunction(this.myForm);
});

/*
module.exports = {
  taxBands,
  lbttCalculator,
  createReturnObj,
  notZero,
  addTax,
  createTaxBandObj,
  filterTheInput
}
*/
