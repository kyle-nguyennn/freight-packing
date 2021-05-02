import { TripleShape } from "../models/shape";

export interface SpaceDivisable {
    splitSpace(container: TripleShape, obj: TripleShape): TripleShape[];
}
export class BLFHeuristic implements SpaceDivisable{
    // in this class empty space will be split by occupied object into top, front, and right
    splitSpace(container: TripleShape, obj: TripleShape): TripleShape[] {
        const result: TripleShape[] = [];
        if (container.height > obj.height)
            result.push(new TripleShape(obj.length, obj.width, container.height - obj.height))
        if (container.width > obj.width)
            result.push(new TripleShape(obj.length, container.width - obj.width, container.height))
        if (container.length > obj.length)
            result.push(new TripleShape(container.length - obj.length, container.width, container.height))
        return result;
    }
}