import { v3S3Service } from "../../application/storageService";
import { mongooseShippingZoneRepository, } from "../../infra/repositories/shipping";
import { CreateShippingZone } from "./createShippingZone";
import { CreateShippingZoneController } from "./createShippingZoneController";

export const createShippingZone: CreateShippingZone = new CreateShippingZone(mongooseShippingZoneRepository, v3S3Service);
export const createShippingZoneController: CreateShippingZoneController = new CreateShippingZoneController(createShippingZone);
