import { ContainerSpec, Dimensions } from "../interfaces";
import { volume } from "../utils";

export class ContainerState implements ContainerSpec{
    constructor(public containerType: string, public dimensions: Dimensions,
                public state: number = 0) {}

    static fromContainerSpec(spec: ContainerSpec, state: number = 0): ContainerState {
        return new this(spec.containerType, spec.dimensions, state);
    }

    volume(): number {
        return volume(this.dimensions);
    }

    getSpec(): ContainerSpec {
        return {
            containerType: this.containerType,
            dimensions: this.dimensions
        }
    }
}