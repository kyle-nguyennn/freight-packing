import { Item, TripleShape } from "../models/shape";
import { BLFHeuristic } from "./blf-heuristic";
import { canFit, emptySpace, mergeIsoSpace, mergeSpace } from "../utils";

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
                for (let orientedObj of objType.dimensions.allOrientations())
                if (canFit(container, orientedObj)) {
                    objs.filter(obj => obj.dimensions.isomorphic(orientedObj))
                        .forEach(obj => obj.quantity--);
                    // mergeSpace should be functional - no mutate input
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
                        const childResult:Item[] = this.knapsack(objs, subContainer); // this line does not change obj at all, since all the decrement has a corresponding increment
                        // changes in each child decision affect each other, since they are in the same universe
                        // apply back child changes to obj
                        childResult.forEach(item => {
                            objs.filter(obj => obj.dimensions.isomorphic(item.dimensions))
                                .map(obj => obj.quantity -= item.quantity)
                        });
                        localResult = mergeSpace(localResult, childResult);
                    }
                    const localEmptySpace = emptySpace(container, localResult);
                    if (localEmptySpace < resultEmptySpace) {
                        result = localResult;
                        resultEmptySpace = localEmptySpace;
                    }
                    // undo all decrement to objs in this branch of the universe
                    Object.assign(objs, mergeIsoSpace(objs, localResult));
                }
            }
        }
        return result;
    }
    solve(objs: Item[], container: TripleShape): Item[] {
        return this.knapsack(objs, container);
    }
}