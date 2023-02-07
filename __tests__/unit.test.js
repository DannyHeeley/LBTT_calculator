const { filterTheInput, taxBands, lbttCalculator, createReturnObj, notZero, addTax, createTaxBandObj }
  = require("../main.js");

describe("createTaxBandObj tests", () => {
  test("Should return an array containining 5 objects when passed a number", () => {
    expect(createTaxBandObj(-1).length).toEqual(5);
    expect(createTaxBandObj(10).length).toEqual(5);
    expect(createTaxBandObj(150000).length).toEqual(5);
    expect(createTaxBandObj(500000).length).toEqual(5);
    expect(createTaxBandObj(800000).length).toEqual(5);
    expect(createTaxBandObj(9999999999).length).toEqual(5);
  });
  test("Original data in taxBands should be unmodified", () => {
    expect(createTaxBandObj(1)[0].bandlow).toEqual(0);
    expect(createTaxBandObj(249999)[1].bandlow).toEqual(145001);
    expect(createTaxBandObj(350000)[2].bandlow).toEqual(250001);
    expect(createTaxBandObj(800000)[3].bandlow).toEqual(325001);
    expect(createTaxBandObj(800000000)[4].bandlow).toEqual(750001);

    expect(createTaxBandObj(1)[0].bandhigh).toEqual(145000);
    expect(createTaxBandObj(249999)[1].bandhigh).toEqual(250000);
    expect(createTaxBandObj(350000)[2].bandhigh).toEqual(325000);
    expect(createTaxBandObj(800000)[3].bandhigh).toEqual(750000);
    expect(createTaxBandObj(800000000)[4].bandhigh).toEqual(Infinity);

    expect(createTaxBandObj(1)[0].rate).toEqual(0);
    expect(createTaxBandObj(249999)[1].rate).toEqual(0.02);
    expect(createTaxBandObj(350000)[2].rate).toEqual(0.05);
    expect(createTaxBandObj(800000)[3].rate).toEqual(0.10);
    expect(createTaxBandObj(800000000)[4].rate).toEqual(0.12);

  });
  test("amountTaxedInBand should be correct in all cases", () => {
    expect(createTaxBandObj(1)[0].amountTaxedInBand).toEqual(1);
    expect(createTaxBandObj(249999)[1].amountTaxedInBand).toEqual(104999);
    expect(createTaxBandObj(350000)[2].amountTaxedInBand).toEqual(74999);
    expect(createTaxBandObj(800000)[3].amountTaxedInBand).toEqual(424999);
    expect(createTaxBandObj(800000000)[4].amountTaxedInBand).toEqual(799250003);
  });
  /*
  test("maxTaxInBand should be correct in all cases", () => {
    expect(createTaxBandObj(1)[0].maxTaxInBand).toEqual(145000);
    expect(createTaxBandObj(249999)[1].maxTaxInBand).toEqual(104999);
    expect(createTaxBandObj(350000)[2].maxTaxInBand).toEqual(74999);
    expect(createTaxBandObj(800000)[3].maxTaxInBand).toEqual(424999);
    expect(createTaxBandObj(800000000)[4].maxTaxInBand).toEqual(Infinity);
  });*/
});

describe("addTax tests", () => {
  test("It should return a positive number when passed a returnObj that was passed a positive number", () => {
    const taxBandObj = createTaxBandObj(800000);
    const returnObj = createReturnObj(taxBandObj);
    expect(addTax(returnObj.taxBands)).toBeGreaterThanOrEqual(0);
    expect(addTax(returnObj.taxBands)).toBeGreaterThanOrEqual(0);
  });
  test("It should return zero when passed a returnObj that was passed a negative number", () => {
    const taxBandObj = createTaxBandObj(-800000);
    const returnObj = createReturnObj(taxBandObj);
    expect(addTax(returnObj.taxBands)).toEqual(0);
    expect(addTax(returnObj.taxBands)).toEqual(0);
  });
});

describe("notZero tests", () => {
  test("It should throw an error if passed 0 or -0", () => {
    expect(() => { notZero(0); }).toThrow(Error);
    expect(() => { notZero(-0); }).toThrow(Error);
  });
  test("It should throw an error if passed undefined or null", () => {
    expect(() => { notZero(undefined); }).toThrow(Error);
    expect(() => { notZero(null); }).toThrow(Error);
  });
});

describe("createReturnObj tests", () => {
  test("It should return an object containing the correct tax paid in each band", () => {
    const taxBandObj = createTaxBandObj(800000);;
    const returnObj = createReturnObj(taxBandObj);
    expect(returnObj.taxBands[0].tax).toEqual(0);
    expect(returnObj.taxBands[1].tax).toEqual(2100);
    expect(returnObj.taxBands[2].tax).toEqual(3750);
    expect(returnObj.taxBands[3].tax).toEqual(42500);
    expect(returnObj.taxBands[4].tax).toEqual(6000);
  });
  test("It should return an object containing the correct max tax in each band", () => {
    const taxBandObj = createTaxBandObj(800000);;
    const returnObj = createReturnObj(taxBandObj);
    expect(returnObj.taxBands[0].maxTaxedInBand).toEqual(145000);
    expect(returnObj.taxBands[1].maxTaxedInBand).toEqual(104999);
    expect(returnObj.taxBands[2].maxTaxedInBand).toEqual(74999);
    expect(returnObj.taxBands[3].maxTaxedInBand).toEqual(424999);
    expect(returnObj.taxBands[4].maxTaxedInBand).toEqual(Infinity);
  });
  test("It should return an object containing the amount taxed in each band", () => {
    const taxBandObj = createTaxBandObj(800000);;
    const returnObj = createReturnObj(taxBandObj);
    expect(returnObj.taxBands[0].amountTaxedInBand).toEqual(145000);
    expect(returnObj.taxBands[1].amountTaxedInBand).toEqual(104999);
    expect(returnObj.taxBands[2].amountTaxedInBand).toEqual(74999);
    expect(returnObj.taxBands[3].amountTaxedInBand).toEqual(424999);
    expect(returnObj.taxBands[4].amountTaxedInBand).toEqual(50003);
  });
  test("It should return an object containing an object 'taxBands'", () => {
    let taxBandObj = createTaxBandObj(800000);;
    let returnObj = createReturnObj(taxBandObj);
    expect(typeof returnObj).toBe("object");
    expect(Object.getOwnPropertyNames(returnObj)[3]).toBe("taxBands");
    expect(typeof returnObj.taxBands).toBe("object");
    taxBandObj = createTaxBandObj(200000);;
    returnObj = createReturnObj(taxBandObj);
    expect(typeof returnObj).toEqual("object");
    expect(Object.getOwnPropertyNames(returnObj)[3]).toBe("taxBands");
    expect(typeof returnObj.taxBands).toBe("object");
  });
});

describe("filterTheInput tests", () => {
  test("Should throw an error when passed a string without any numbers", () => {
    expect(() => {filterTheInput(""); }).toThrow(Error);
    expect(() => {filterTheInput("s"); }).toThrow(Error);
    expect(() => {filterTheInput("throw an error"); }).toThrow(Error);
    expect(() => {filterTheInput("@+=-"); }).toThrow(Error);
    expect(() => {filterTheInput("|\/////////"); }).toThrow(Error);
    expect(() => {filterTheInput("     "); }).toThrow(Error);
  });
  test("Should ignore anything but numbers", () => {
    expect(filterTheInput("1     ")).toEqual(1);
    expect(filterTheInput("dd3232323jijdi")).toEqual(3232323);
    expect(filterTheInput("8 0 0 0 0 0")).toEqual(800000);
    expect(filterTheInput("test800...0/0@0-+")).toEqual(800000);
    expect(filterTheInput("£800000")).toEqual(800000);
  });
});
