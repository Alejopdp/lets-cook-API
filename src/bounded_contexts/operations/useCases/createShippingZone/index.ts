import { s3Service } from "../../application/storageService";
import { mongooseShippingZoneRepository, } from "../../infra/repositories/shipping";
import { CreateShippingZone } from "./createShippingZone";
import { CreateShippingZoneController } from "./createShippingZoneController";

// export const createPlan: CreatePlan = new CreatePlan(mockPlanRepository, s3Service);
export const createShippingZone: CreateShippingZone = new CreateShippingZone(mongooseShippingZoneRepository, s3Service);
export const createShippingZoneController: CreateShippingZoneController = new CreateShippingZoneController(createShippingZone);
