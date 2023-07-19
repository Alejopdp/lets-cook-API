import { s3Service } from "../../application/storageService";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { UpdateShippingZone } from "./updateShippingZoneState";
import { UpdateShippingZoneStateController } from "./updateShippingZoneStateController";

export const updateShippingZoneState: UpdateShippingZone = new UpdateShippingZone(mongooseShippingZoneRepository, s3Service);
export const updateShippingZoneStateController: UpdateShippingZoneStateController = new UpdateShippingZoneStateController(updateShippingZoneState);
