import { Dimensions } from "./interfaces";

export const zip = (a: Array<any>, b: Array<any>): Array<Array<any>> =>
    a.map((v, i) => [v, b[i]]);

export const dimensionsToArray = (dim: Dimensions): Array<number> =>
    Object.entries(dim)
    .filter(([k, _]) => k !== 'unit')
    .map(([_, v]) => v);