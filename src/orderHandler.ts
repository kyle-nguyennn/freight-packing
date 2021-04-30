import { ContainerSpec, Dimensions, OrderRequest, ShipmentRecord } from "./interfaces";
import { ContainerState } from "./models/container";
import { ExtendedOrderRequest, Product, ContainerResult } from "./models/extended-types";
import { ISolver } from "./solvers/solver-base";
import { SolverFactory } from "./solvers/solver-factory";
import { dimensionsToArray, totalVolume, zip } from "./utils";

const UNIT_LENGTH = "centimeter";
const UNIT_VOLUME = "cubic centimeter";
const DEFAULT_SOLVER = "FirstFitSolver";

export class OrderHandler {
  constructor(private parameters: { containerSpecs: ContainerSpec[] }) {}

  packOrder(orderRequest: ExtendedOrderRequest): ShipmentRecord {
    // My naive implementation: first fit
    // ASSUMPTION: all dimension used are in the same unit === 'centimeter'
    const orderId = orderRequest.id;
    const solver: ISolver = SolverFactory.loadSolver(orderRequest.solver || DEFAULT_SOLVER);
    const {containerResults, emptyVolume} = solver.solve(
      this.parameters.containerSpecs, orderRequest.products
    )
    console.log(`The solution gives empty volume: ${emptyVolume}`);
    const result: ShipmentRecord = {
      orderId: orderId,
      totalVolume: {
        unit: UNIT_VOLUME,
        value: totalVolume(containerResults, this.parameters.containerSpecs),
      },
      containers: containerResults,
    };
    return result;
  }
}
