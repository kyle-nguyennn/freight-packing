import { Dimensions, ContainerSpec } from "../interfaces";
import { ContainerState } from "../models/container";
import { ContainerResult, Product } from "../models/extended-types";
import { ISolver } from "./solver-base";
import * as _ from "lodash";
import { arrayToDimension, emptySpace, EMPTY_CONTAINER_RESULT, mergeContainerResult, VIRTUAL_CONTAINER_TYPE, zeroProduct } from "../utils";
import { Knapsack3DSolver, DFSKnapsack3DSolver } from "./knapsack";
import { Item, TripleShape } from "../models/shape";

export class BLFSolver implements ISolver {
    private knapsackSolver: Knapsack3DSolver;
    constructor() {
        // TODO: implement dependency injection for this
        this.knapsackSolver = new DFSKnapsack3DSolver();
    }
    fitProductToContainer(product: Product, container: ContainerState): number {
        return 0;
    }

    splitSpace(containerDim: Dimensions, occupiedDim: Dimensions): Dimensions[] {
        // in this class empty space will be split by occupied object into top, front, and right
        // TODO: move out into a mixin
        const top = [occupiedDim.length, occupiedDim.width, containerDim.height - occupiedDim.height];
        const front = [occupiedDim.length, containerDim.width - occupiedDim.width, containerDim.height];
        const right = [containerDim.length - occupiedDim.length, containerDim.width, containerDim.height];
        return [arrayToDimension(top), arrayToDimension(front), arrayToDimension(right)];
    }

    fitProductsToContainer(products: Product[], container: ContainerState): {
        containerResult: ContainerResult,
        emptyVolume: number
    } {
        /**
         * Fits one product in products into container and recursively call itself on the empty space of the container with the rest of the products
         * NOTE: The method mutate the state of products
         * @param products the products to be fit into container
         * @param container always a new containerState, full retangular prism not occupied in any part
         * @returns the ContainerResult which describe all the products it contains, and the emptyVolume left.
         */
        // stop condition
        const containerResult: ContainerResult = {
            containerType: container.containerType,
            containingProducts: []
        };
        let result = {
            containerResult: containerResult,
            emptyVolume: 0
        };
        // transform input to format that Knapsack solver accept
        const knapsackSol: Item[] = this.knapsackSolver.solve(
            products.map(product => ({
                dimensions: TripleShape.fromDimensions(product.dimensions),
                quantity: product.orderedQuantity})),
            container.getShape()
        );
        // construct result from knapsack solution
        const shapeToProductIdMap: {[k: string]: string} = products.reduce((m, product) =>
            ({...m, [TripleShape.fromDimensions(product.dimensions).serialize()]: product.id}),
            {});
        result.emptyVolume = emptySpace(container.getShape(), knapsackSol);
        containerResult.containingProducts = knapsackSol.map(item => ({
            id: shapeToProductIdMap[item.dimensions.serialize()],
            quantity: item.quantity
        }));
        return result;
    }

    solve(containerSpecs: ContainerSpec[], products: Product[]): {
        containerResults: ContainerResult[],
        emptyVolume: number
    } {
        const containerResults: ContainerResult[] = [];
        let emptyVolume = 0;
        // create new productList because there will be side effect changing product list
        const productList = _.cloneDeep(products);
        for (let containerSpec of containerSpecs) {
            let result;
            do { // greedily fit products into this type of container until cannot anymore
                const newContainer = ContainerState.fromContainerSpec(containerSpec);
                result = this.fitProductsToContainer(productList, newContainer);
                // if (can fit something in new container) add to containerResults
                if (result) {
                    containerResults.push(result.containerResult);
                    emptyVolume += result.emptyVolume;
                }
            } while (result); // can fit any more product into this type of container anymore
        }
        if (zeroProduct(productList)) throw Error("Cannot fit product into any container.")
        return {
            containerResults: containerResults,
            emptyVolume: emptyVolume
        };
    }
}