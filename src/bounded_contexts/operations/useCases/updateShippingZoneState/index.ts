import { v3S3Service } from "../../application/storageService";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { UpdateShippingZone } from "./updateShippingZoneState";
import { UpdateShippingZoneStateController } from "./updateShippingZoneStateController";

export const updateShippingZoneState: UpdateShippingZone = new UpdateShippingZone(mongooseShippingZoneRepository, v3S3Service);
export const updateShippingZoneStateController: UpdateShippingZoneStateController = new UpdateShippingZoneStateController(updateShippingZoneState);
