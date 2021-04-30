import { ContainerSpec, ShipmentRecord } from "./interfaces";
import { ExtendedOrderRequest } from "./models/extended-types";
import { ISolver } from "./solvers/solver-base";
import { SolverFactory } from "./solvers/solver-factory";
import { totalVolume } from "./utils";

const UNIT_VOLUME = "cubic centimeter";
const DEFAULT_SOLVER = "FirstFitSolver";

export class OrderHandler {
  constructor(private parameters: { containerSpecs: ContainerSpec[] }) {}

  packOrder(orderRequest: ExtendedOrderRequest): ShipmentRecord {
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
