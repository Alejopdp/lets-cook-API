import { v3S3Service } from "../../application/storageService";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { UpdateShippingZone } from "./updateShippingZone";
import { UpdateShippingZoneController } from "./updateShippingZoneController";

export const updateShippingZone: UpdateShippingZone = new UpdateShippingZone(mongooseShippingZoneRepository, v3S3Service);
export const updateShippingZoneController: UpdateShippingZoneController = new UpdateShippingZoneController(updateShippingZone);
