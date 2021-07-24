import { IOrderRepository } from "./IOrderRepository";
import { MongooseOrderRepository } from "./mongooseOrderRepository";

export const mongooseOrderRepository: IOrderRepository = new MongooseOrderRepository();
