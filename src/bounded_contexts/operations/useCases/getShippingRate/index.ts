import { s3Service } from "../../application/storageService";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { GetShippingRate } from "./getShippingRate";
import { GetShippingRateController } from "./getShippingRateController";

// export const getPlanList = new GetPlanList(mockPlanRepository, s3Service);
export const getShippingRate = new GetShippingRate(mongooseShippingZoneRepository, s3Service);
export const getShippingRateController = new GetShippingRateController(getShippingRate);
