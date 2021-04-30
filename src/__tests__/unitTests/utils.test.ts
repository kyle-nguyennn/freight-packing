import { Dimensions } from "../../interfaces";
import { dimensionsToArray, zip } from "../../utils";

describe("Utility functions Test Cases", () => {
  test("Zip 2 arrays of number", () => {
    const a = [1,2,3];
    const b = [4,5,6];
    const expected = [[1,4], [2,5], [3,6]];
    expect(zip(a, b)).toEqual(expected);
  });

  test("Return dimension as an array of 3 numbers", () => {
    const dim: Dimensions = {
      unit: '',
      length: 10,
      width: 20,
      height: 30,
    };
    const expected = [10, 20, 30];
    expect(dimensionsToArray(dim)).toEqual(expected);
  });

  test("Reduce 2 dimensions", () => {
    const d1 = [10, 10, 30];
    const d2 = [30, 30, 30];
    const expected = 9;

    expect(zip(d1, d2).reduce(
      (cum, [a, b]) => cum*Math.floor(b/a), 1
    )).toEqual(expected);
  });
});
