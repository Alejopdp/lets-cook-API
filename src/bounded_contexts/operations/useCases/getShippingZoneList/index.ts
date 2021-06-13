import { s3Service } from "../../application/storageService";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { GetShippingZoneList } from "./getShippingZoneList";
import { GetShippingListController } from "./getShippingZoneListController";

// export const getPlanList = new GetPlanList(mockPlanRepository, s3Service);
export const getShippingList = new GetShippingZoneList(mongooseShippingZoneRepository, s3Service);
export const getShippingListController = new GetShippingListController(getShippingList);
