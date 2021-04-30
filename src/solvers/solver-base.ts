import { ContainerSpec } from "../interfaces";
import { ContainerState } from "../models/container";
import { ContainerResult, Product } from "../models/extended-types";

export interface ISolver {
    fitProductToContainer(product: Product, container: ContainerState): number;
    /**
     * Fits as many instances of product into container at a particular state.
     * The function might mutate the state of container to mark the placement of 1 instance of product inside the container
     * @param product the product to be fit into container
     * @param container the container, note that container might be partially occupied by some other product already
     * @returns the maximum number of instances of product that can be fitted inside container
     */

    solve(containerSpecs: ContainerSpec[], products: Product[]): {
        containerResults: ContainerResult[],
        emptyVolume: number
    };
    /**
     * Construct a solution/arrangement of all products into some containers.
     * Throw error if exist an oversized product that does not fit into any of the containers.
     * @param containerSpecs list of container types to be used, there are infinite number of each type
     * @param products list of products to be packed
     * @returns a valid arrangement
     */
}