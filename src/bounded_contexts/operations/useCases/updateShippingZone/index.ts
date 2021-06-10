import { s3Service } from "../../application/storageService";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { UpdateShippingZone } from "./updateShippingZone";
import { UpdateShippingZoneController } from "./updateShippingZoneController";

// export const updatePlan: UpdatePlan = new UpdatePlan(mockPlanRepository, s3Service);
export const updateShippingZone: UpdateShippingZone = new UpdateShippingZone(mongooseShippingZoneRepository, s3Service);
export const updateShippingZoneController: UpdateShippingZoneController = new UpdateShippingZoneController(updateShippingZone);
