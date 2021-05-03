import { Dimensions } from "../../interfaces";
import { Item, TripleShape } from "../../models/shape";
import { canFit, dimensionsToArray, emptySpace, mergeIsoSpace, mergeSpace, permutator, zip } from "../../utils";

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

  test("Permute array of number", () => {
    const arr = [1,2,3];
    expect(permutator(arr).length).toBe(6);
  });

  test("Test if obj fits in container", () => {
    const container = new TripleShape(1, 1, 2);
    const obj =  new TripleShape(1, 1, 1);
    expect(canFit(container, obj)).toBeTruthy();
  });

  test("Test calculating empty space", () => {
    const container = new TripleShape(1, 1, 2);
    const items: Item[] = [{
      dimensions: new TripleShape(1, 1, 1),
      quantity: 2
    }];
    expect(emptySpace(container, items)).toBe(0);
  });

  test("Test merge space", () => {
    const items1: Item[] = [{
      dimensions: new TripleShape(1, 1, 1),
      quantity: 2
    }];
    const items2: Item[] = [{
      dimensions: new TripleShape(1, 1, 1),
      quantity: 1
    }];
    const expected: Item[] = [{
      dimensions: new TripleShape(1, 1, 1),
      quantity: 3
    }];
    expect(mergeSpace(items1, items2)[0].quantity).toBe(3);
  });

  test("Test compare isomorphic space", () => {
    const shape1 = new TripleShape(1, 2, 3);
    const shape2 = new TripleShape(2, 1, 3);
    expect(shape1.isomorphic(shape2)).toBeTruthy();
  });

  test("Test merge iso space", () => {
    const items1: Item[] = [{
      dimensions: new TripleShape(3, 1, 2),
      quantity: 1
    }];
    const items2: Item[] = [{
      dimensions: new TripleShape(2, 1, 3),
      quantity: 2
    }];
    const expected: Item[] = [{
      dimensions: new TripleShape(3, 1, 2),
      quantity: 3
    }];
    const result = mergeIsoSpace(items1, items2);
    expect(result.length).toEqual(expected.length);
    expect(result[0].quantity).toEqual(expected[0].quantity);
  });
});
