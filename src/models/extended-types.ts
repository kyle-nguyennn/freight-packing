import { OrderRequest, ShipmentRecord } from "../interfaces";

export type Product = OrderRequest["products"][0];

export type ContainerResult = ShipmentRecord['containers'][0];

export interface ExtendedOrderRequest extends OrderRequest {
    solver?: string
}