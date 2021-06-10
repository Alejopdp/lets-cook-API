import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { GetShippingZoneById } from "./getShippingZoneById";
import { GetShippingZoneByIdController } from "./getShippingZoneByIdController";

export const getShippingZoneById: GetShippingZoneById = new GetShippingZoneById(mongooseShippingZoneRepository);
export const getShippingZoneByIdController: GetShippingZoneByIdController = new GetShippingZoneByIdController(getShippingZoneById);