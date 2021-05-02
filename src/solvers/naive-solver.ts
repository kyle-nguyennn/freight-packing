import { Dimensions, ContainerSpec } from "../interfaces";
import { ContainerState } from "../models/container";
import { ContainerResult, Product } from "../models/extended-types";
import { dimensionsToArray, volume, zip } from "../utils";
import { ISolver } from "./solver-base";

export class FirstFitSolver implements ISolver {
    // My naive implementation: first fit
    fitProductToContainer(product: Product, container: ContainerState): number {
        let productDims = dimensionsToArray(product.dimensions);
        let containerDims = dimensionsToArray(container.dimensions);
        productDims.sort();
        containerDims.sort();
        return zip(productDims, containerDims).reduce(
            (result, [a, b]) => result * (Math.floor(b / a)), 1
        );
    }

    solve(containerSpecs: ContainerSpec[], products: Product[]): {
        containerResults: ContainerResult[],
        emptyVolume: number
    } {
        const containers: ContainerResult[] = [];
        let emptyVolume = 0;
        for (let product of products) {
            let quantity = product.orderedQuantity;
            // always open a new container for a different product
            // use the first container that can fit current product
            for (let containerSpec of containerSpecs) {
                const newContainer = ContainerState.fromContainerSpec(containerSpec);
                const nProductFitted = this.fitProductToContainer(product, newContainer);
                if (nProductFitted <= 0) continue;
                while (quantity > 0) {
                    const actualQuantity = Math.min(nProductFitted, quantity);
                    emptyVolume += newContainer.volume() - actualQuantity * volume(product.dimensions);
                    containers.push({
                        containerType: newContainer.containerType,
                        containingProducts: [{
                            id: product.id,
                            quantity: actualQuantity
                        }]
                    });
                    quantity -= nProductFitted;
                }
            }
            if (quantity > 0) { // there's no container to hold this product
                throw Error("Cannot fit product into any container.")
            }
        }
        return {
            containerResults: containers,
            emptyVolume: emptyVolume
        };
    }
}