import { ContainerSpec, Dimensions } from "./interfaces";
import { ContainerResult } from "./models/extended-types";

export const zip = (a: Array<any>, b: Array<any>): Array<Array<any>> =>
    a.map((v, i) => [v, b[i]]);

export const dimensionsToArray = (dim: Dimensions): Array<number> =>
    Object.entries(dim)
    .filter(([k, _]) => k !== 'unit')
    .map(([_, v]) => v);

export const volume = (dims: Dimensions): number => dims.width * dims.length * dims.height;

export const totalVolume = (containerResults: ContainerResult[], containerSpecs: ContainerSpec[]): number =>
    containerResults.reduce(
        (res, containerResult) => res + containerSpecs
            .filter(spec => spec.containerType === containerResult.containerType)
            .reduce((cum, spec) => cum + volume(spec.dimensions), 0),
        0
    );