import { Dimensions } from "../interfaces";
import { permutator } from "../utils";

export class TripleShape implements Omit<Dimensions, "unit"> {
    constructor(public length: number, public width: number, public height: number) {}
    static fromList(arr: number[]) {
        if (arr.length !== 3) throw Error("Array must have length 3 to be converted to a TripleShape.");
        return new TripleShape(arr[0], arr[1], arr[2]);
    }
    static fromDimensions(dims: Dimensions) {
        return new this(dims.length, dims.width, dims.height);
    }
    volume = () => this.length * this.width * this.height;

    dimensionsToList = (): number[] => [this.length, this.width, this.height];

    allOrientations(): TripleShape[] {
        return Object.values(permutator(this.dimensionsToList()).map(TripleShape.fromList)
            .reduce((cum, shape) => ({...cum, [shape.serialize()]: shape}), {})
        );
    }
    serialize = (): string => this.length.toString() + '|' + this.width.toString() + '|' + this.height.toString();
    static deserialize = (str: string): TripleShape => TripleShape.fromList(str.split('|').map(str => parseFloat(str)));
}

export type Item = {dimensions: TripleShape, quantity: number};