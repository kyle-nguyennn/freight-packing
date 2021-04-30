import { ContainerSpec, Dimensions, OrderRequest, ShipmentRecord } from "./interfaces";
import { ContainerState } from "./models/container";
import { Product } from "./models/extended-types";
import { dimensionsToArray, zip } from "./utils";

const UNIT_LENGTH = "centimeter";
const UNIT_VOLUME = "cubic centimeter";

export class OrderHandler {
  constructor(private parameters: { containerSpecs: ContainerSpec[] }) {}

  packOrder(orderRequest: OrderRequest): ShipmentRecord {
    // my naive implementation
    // ASSUMPTION: all dimension used are in the same unit === 'centimeter'
    const orderId = orderRequest.id;
    const result: ShipmentRecord = {
      orderId: orderId,
      totalVolume: {
        unit: UNIT_VOLUME,
        value: 0,
      },
      containers: [],
    };
    for (let product of orderRequest.products) {
      let quantity = product.orderedQuantity;
      // always open a new container for a different product
      // use the first container that can fit current product
      for (let containerSpecs of this.parameters.containerSpecs) {
        const newContainer = ContainerState.fromContainerSpec(containerSpecs);
        const nProductFitted = this.fitProductToContainer(product, newContainer);
        if (nProductFitted <= 0) continue;
        while (quantity > 0) {
          result.totalVolume.value += newContainer.volume();
          result.containers.push({
            containerType: newContainer.containerType,
            containingProducts: [{
              id: product.id,
              quantity: Math.min(nProductFitted, quantity)
            }]
          });
          quantity -= nProductFitted;
        }
      }
      if (quantity > 0) { // there's no container to hold this product
        throw Error("Cannot fit product into any conainer.")
      }
    }
    return result;
  }

  fitProductToContainer(product: Product, container: ContainerState): number {
    let productDims = dimensionsToArray(product.dimensions);
    let containerDims = dimensionsToArray(container.dimensions);
    productDims.sort();
    containerDims.sort();
    return zip(productDims, containerDims).reduce(
      (result, [a, b]) => result*(Math.floor(b/a)), 1
    );
  }
}
