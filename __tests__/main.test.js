const { taxBands, lbttCalculator, createReturnObj, notZero, addTax, createTaxBandObj }
  = require("../main.js");

describe("lbttCalculator tests", () => {
  test("totalTax should be 0 when passed any number less than 145000", () => {
    expect(lbttCalculator(1).totalTax).toEqual(0);
    expect(lbttCalculator(100).totalTax).toEqual(0);
    expect(lbttCalculator(9999).totalTax).toEqual(0);
    expect(lbttCalculator(12345).totalTax).toEqual(0);
    expect(lbttCalculator(144999).totalTax).toEqual(0);
  });
  test("Should throw an error when passed a string without any numbers", () => {
    expect(() => {lbttCalculator(""); }).toThrow(Error);
    expect(() => {lbttCalculator("s"); }).toThrow(Error);
    expect(() => {lbttCalculator("throw an error"); }).toThrow(Error);
    expect(() => {lbttCalculator("@+=-"); }).toThrow(Error);
    expect(() => {lbttCalculator("|\/////////"); }).toThrow(Error);
    expect(() => {lbttCalculator("     "); }).toThrow(Error);
  });
  test("Should throw an error when passed 0", () => {
    expect(() => {lbttCalculator(0); }).toThrow(Error);
    expect(() => {lbttCalculator("0"); }).toThrow(Error);
  });
  test("Should ignore anything but numbers", () => {
    expect(lbttCalculator("1     ").totalTax).toEqual(0);
    expect(lbttCalculator("dd3232323jijdi").purchasePrice).toEqual(3232323);
    expect(lbttCalculator("8 0 0 0 0 0").taxPercentage).toEqual(6.79);
    expect(lbttCalculator("test800...0/0@0-+").totalTax).toEqual(54350);
    expect(lbttCalculator("£800000").totalTax).toEqual(54350);
  });
  test("Should return the correct tax in all cases", () => {
    expect(lbttCalculator(1).totalTax).toEqual(0);
    expect(lbttCalculator(249999).totalTax).toEqual(2100);
    expect(lbttCalculator(350000).totalTax).toEqual(8350);
    expect(lbttCalculator(800000).totalTax).toEqual(54350);
    expect(lbttCalculator(800000000).totalTax).toEqual(95958350);
  });
  test("Should return the correct tax percentage in all cases", () => {
    expect(lbttCalculator(1).taxPercentage).toEqual(0);
    expect(lbttCalculator(249999).taxPercentage).toEqual(0.84);
    expect(lbttCalculator(350000).taxPercentage).toEqual(2.39);
    expect(lbttCalculator(800000).taxPercentage).toEqual(6.79);
    expect(lbttCalculator(800000000).taxPercentage).toEqual(11.99);
  });

  //test("", () => {
    //expect(lbttCalculator()).toEqual();
  //});
});
