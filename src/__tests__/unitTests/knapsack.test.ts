import { Item, TripleShape } from "../../models/shape";
import { DFSKnapsack3DSolver } from "../../solvers/knapsack";

describe("Knapsack Test Cases", () => {
    const solver = new DFSKnapsack3DSolver();

    test("Trivial case", () => {
        const container = new TripleShape(1, 1, 1);
        const objs: Item[] = [
            {
                dimensions: new TripleShape(1, 1, 1),
                quantity: 1
            }];
        const result = solver.solve(objs, container);
        const expected = [{
            dimensions: new TripleShape(1,1,1),
            quantity: 1
        }];
        expect(result.length).toEqual(expected.length);
        expect(result[0].quantity).toEqual(expected[0].quantity);
    });

    test("Complete small case", () => {
        const container = new TripleShape(1, 1, 2);
        const objs: Item[] = [
            {
                dimensions: new TripleShape(1, 1, 1),
                quantity: 2
            }];
        const result = solver.solve(objs, container);
        const expected = [{
            dimensions: new TripleShape(1,1,1),
            quantity: 2
        }];
        expect(result.length).toEqual(expected.length);
        expect(result[0].quantity).toEqual(expected[0].quantity);
    });

    test("Complete medium case 1", () => {
        const container = new TripleShape(2, 2, 2);
        const objs: Item[] = [
            {
                dimensions: new TripleShape(2, 1, 1),
                quantity: 4
            }];
        const result = solver.solve(objs, container);
        const expected = [{
            dimensions: new TripleShape(2, 2, 1),
            quantity: 4
        }];
        expect(result.length).toEqual(expected.length);
        expect(result[0].quantity).toEqual(expected[0].quantity);
    });

    test("Complete medium case 2", () => {
        const container = new TripleShape(30, 30, 30);
        const objs: Item[] = [
            {
                dimensions: new TripleShape(10, 10, 30),
                quantity: 9
            }];
        const result = solver.solve(objs, container);
        const expected = [{
            dimensions: new TripleShape(10, 10, 30),
            quantity: 9
        }];
        expect(result.length).toEqual(expected.length);
        expect(result[0].quantity).toEqual(expected[0].quantity);
    });
});