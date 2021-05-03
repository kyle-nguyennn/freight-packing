import { ContainerSpec, Dimensions } from "./interfaces";
import { ContainerResult, Product } from "./models/extended-types";
import { Shape, TripleShape, Item } from "./models/shape";

export const UNIT_LENGTH = "centimeter";
export const UNIT_VOLUME = "cubic centimeter";
export const VIRTUAL_CONTAINER_TYPE = "virtual";

export const EMPTY_CONTAINER_RESULT: ContainerResult = {
    containerType: "",
    containingProducts: []
}

export const zip = (a: Array<any>, b: Array<any>): Array<Array<any>> =>
    a.map((v, i) => [v, b[i]]);

export const dimensionsToArray = (dim: Dimensions): Array<number> =>
    Object.entries(dim)
    .filter(([k, _]) => k !== 'unit')
    .map(([_, v]) => v);

export const arrayToDimension = (arr: number[]): Dimensions => {
    if (arr.length !== 3) throw Error("Array must have length 3 to be converted to Dimensions");
    return {
        unit: UNIT_LENGTH,
        length: arr[0],
        width: arr[1],
        height: arr[2]
    }
}

export const volume = (dims: Dimensions): number => dims.width * dims.length * dims.height;

export const totalVolume = (containerResults: ContainerResult[], containerSpecs: ContainerSpec[]): number =>
    containerResults.reduce(
        (res, containerResult) => res + containerSpecs
            .filter(spec => spec.containerType === containerResult.containerType)
            .reduce((cum, spec) => cum + volume(spec.dimensions), 0),
        0
    );

export const zeroProduct = (products: Product[]): boolean =>
    products.reduce((cum, product) => cum + product.orderedQuantity, 0) === 0;

export const mergeContainerResult = (parent: ContainerResult, child:ContainerResult): ContainerResult => {
    const products: {id: string, quantity: number}[] = [];
    return {
        containerType: parent.containerType,
        containingProducts: products
    }
}

export function permutator<T>(inputArr: Array<T>) {
    let result: Array<T>[] = [];

    function permute(arr: Array<T>, m: Array<T> = []) {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
            }
        }
    }
    permute(inputArr)
    return result;
}

export function emptySpace(container: TripleShape, items: Item[]) {
    return container.volume() - items.reduce(
        (s, item) => s + item.quantity * item.dimensions.volume(),
        0
    );
}

export function mergeSpace(...args: Readonly<Item>[][]): Item[] {
    // merge disjoined space
    // take orientation of shape into account
    let items: {[itemId: string]: number} = {};
    for (let itemList of args) {
        for (let item of itemList) {
            const id = item.dimensions.serialize();
            items[id] = (items?.[id] ?? 0) + item.quantity;
        }
    }
    return Object.entries(items).map(([id, quantity]) => ({
        dimensions: TripleShape.deserialize(id),
        quantity: quantity
    }));
}

export function mergeIsoSpace(...args: Readonly<Item>[][]): Item[] {
    // form of the same isomorphic shape take priority from left to right in args
    let items: {[itemId: string]: Item[]} = {};
    args.forEach(itemList =>
        itemList.forEach(item => {
            const baseForm = item.dimensions.baseForm().serialize();
            items[baseForm] = [...items[baseForm]??[], item];
        })
    )
    return Object.entries(items).map(([_, items]) => ({
        dimensions: items[0].dimensions,
        quantity: items.reduce((cum, item) => cum + item.quantity, 0)
    }));
}

// canFit check if obj fits in container in the current orientation
export const canFit = (container: Shape, obj: Shape): boolean =>
    zip(Object.values(obj), Object.values(container)).every(([a, b]) => a <= b);

export const canIsoFit = (container: Shape, obj: Shape): boolean =>
    zip(Object.values(obj).sort(), Object.values(container).sort())
    .every(([a, b]) => a <= b);