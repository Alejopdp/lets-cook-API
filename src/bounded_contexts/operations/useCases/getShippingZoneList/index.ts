import { v3S3Service } from "../../application/storageService";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { GetShippingZoneList } from "./getShippingZoneList";
import { GetShippingListController } from "./getShippingZoneListController";

export const getShippingList = new GetShippingZoneList(mongooseShippingZoneRepository, v3S3Service);
export const getShippingListController = new GetShippingListController(getShippingList);
