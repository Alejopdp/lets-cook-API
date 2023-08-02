import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { GetShippingRate } from "./getShippingRate";
import { GetShippingRateController } from "./getShippingRateController";
import { GetShippingRatePresenter } from "./getShippingRatePresenter";

export const getShippingRate = new GetShippingRate(mongooseShippingZoneRepository, mongooseOrderRepository);
export const getShippingRatePresenter = new GetShippingRatePresenter();
export const getShippingRateController = new GetShippingRateController(getShippingRate, getShippingRatePresenter);
