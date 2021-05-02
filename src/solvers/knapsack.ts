import { Item, TripleShape } from "../models/shape";
import { BLFHeuristic } from "./blf-heuristic";
import { canFit, emptySpace, mergeSpace } from "../utils";

const MAX_VOLUME = 1e15; // 1km^3

export interface Knapsack3DSolver {
    solve(objs: Item[], container: TripleShape): Item[];
}

export class DFSKnapsack3DSolver extends BLFHeuristic implements Knapsack3DSolver {
    // Fit as many objs into container so that empty space is minimized
    private knapsack(objs: Item[], container: TripleShape)
    : Array<Item> {
        let result: Array<Item> = [];
        let resultEmptySpace = emptySpace(container, result);
        for (let objType of objs) {
            if (objType.quantity > 0) {
                objType.quantity--;
                for (let orientedObj of objType.dimensions.allOrientations())
                if (canFit(container, orientedObj)) {
                // for (let orientedObj of [objType.dimensions]) {
                    // mergeSpace should be functional
                    let localResult: Item[] = [
                        {
                            dimensions: orientedObj,
                            quantity: 1
                        }
                    ];
                    // each iteration of orientedObj is O(sizeof container)
                    // create 3 new container out of the placement of orientedObj
                    // is the reponsibility of the BLFHeuristic, I don't care how to partition the subproblems
                    const subContainers: TripleShape[] = this.splitSpace(container, orientedObj);
                    for (let subContainer of subContainers) {
                        localResult = mergeSpace(localResult, this.knapsack(objs, subContainer));
                    }
                    const localEmptySpace = emptySpace(container, localResult);
                    if (localEmptySpace < resultEmptySpace) {
                        result = localResult;
                        resultEmptySpace = localEmptySpace;
                    }

                }
                objType.quantity++;
            }
        }
        return result;
    }
    solve(objs: Item[], container: TripleShape): Item[] {
        return this.knapsack(objs, container);
    }
}