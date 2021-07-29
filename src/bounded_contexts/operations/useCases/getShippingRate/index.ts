import { s3Service } from "../../application/storageService";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { GetShippingRate } from "./getShippingRate";
import { GetShippingRateController } from "./getShippingRateController";
import { GetShippingRatePresenter } from "./getShippingRatePresenter";

export const getShippingRate = new GetShippingRate(mongooseShippingZoneRepository, s3Service);
export const getShippingRatePresenter = new GetShippingRatePresenter();
export const getShippingRateController = new GetShippingRateController(getShippingRate, getShippingRatePresenter);
