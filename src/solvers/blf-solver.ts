import { ContainerSpec } from "../interfaces";
import { ContainerState } from "../models/container";
import { ContainerResult, Product } from "../models/extended-types";
import { ISolver } from "./solver-base";
import * as _ from "lodash";
import { canIsoFit, emptySpace, zeroProduct } from "../utils";
import { Knapsack3DSolver, DFSKnapsack3DSolver } from "./knapsack";
import { Item, TripleShape } from "../models/shape";

export class BLFSolver implements ISolver {
    private knapsackSolver: Knapsack3DSolver;
    constructor(private max_iter = 10) {
        // TODO: implement dependency injection for this
        this.knapsackSolver = new DFSKnapsack3DSolver();
    }
    fitProductToContainer(product: Product, container: ContainerState): number {
        return 0;
    }

    fitProductsToContainer(products: Product[], container: ContainerState): {
        containerResult: ContainerResult,
        emptyVolume: number
    } | null {
        /**
         * Fits as many products to container to minimize empty space (Knapsack3D)
         * NOTE: The method mutate the state of products
         * @param products the products to be fit into container
         * @param container always a new containerState, full retangular prism NOT occupied in any part
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
        containerResult.containingProducts = knapsackSol.map(item => {
            const productId = shapeToProductIdMap[item.dimensions.serialize()];
            const product = products.find(product => product.id === productId);
            if (product) product.orderedQuantity -= item.quantity;
            return {
                id: shapeToProductIdMap[item.dimensions.serialize()],
                quantity: item.quantity
            }
        });
        if (containerResult.containingProducts.length === 0) return null;
        return result;
    }

    solve_one(containerSpecs: ContainerSpec[], products: Product[]): {
        containerResults: ContainerResult[],
        emptyVolume: number
    } {
        const containerResults: ContainerResult[] = [];
        let emptyVolume = 0;
        // create new productList because there will be side effect changing product list
        const productList = _.cloneDeep(products);
        // guaranteed to end
        while (!zeroProduct(productList)) {
            const randomIdx = Math.floor(Math.random() * containerSpecs.length);
            const containerSpec = containerSpecs[randomIdx];
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
        return {
            containerResults: containerResults,
            emptyVolume: emptyVolume
        };
    }

    solve(containerSpecs: ContainerSpec[], products: Product[]): {
        containerResults: ContainerResult[],
        emptyVolume: number
    } {
        if (products.some(product =>
            containerSpecs.every(containerSpec => !canIsoFit(containerSpec.dimensions, product.dimensions))
        )) throw Error("Cannot fit product into any container.");

        let result = this.solve_one(containerSpecs, products);
        // since solve_one is randomized in nature, run a few times to get the best result
        for (let iter=1; iter < this.max_iter; iter++) {
            const temp = this.solve_one(containerSpecs, products);
            if (result.emptyVolume > temp.emptyVolume)
                result = temp;
        }
        return result;

    }
}