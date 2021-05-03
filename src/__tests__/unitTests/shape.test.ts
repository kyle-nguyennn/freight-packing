import { Dimensions } from "../../interfaces";
import { TripleShape } from "../../models/shape";

describe("Shape Test Cases", () => {
  test("Creation from Dimensions", () => {
    const dim: Dimensions = {
        unit: '',
        length: 1,
        width: 2,
        height: 3
    };
    const shape = TripleShape.fromDimensions(dim);
    expect(shape.serialize()).toEqual("1|2|3");
  });
  test("Get all orientations of rectangular prism", () => {
    const shape = new TripleShape(1, 2, 3);
    expect(shape.allOrientations().length).toEqual(6);
  });
  test("Shape equal", () => {
    const shape1 = new TripleShape(1, 2, 3);
    const shape2 = new TripleShape(1, 2, 3);
    expect(shape1.equals(shape2)).toBeTruthy();
  });
});
