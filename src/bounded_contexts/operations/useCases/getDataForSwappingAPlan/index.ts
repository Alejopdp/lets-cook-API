import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetDataForSwappingAPlan } from "./getDataForSwappingAPlan";
import { GetDataForSwappingAPlanController } from "./getDataForSwappingAPlanController";
import { GetDataForSwappingAPlanPresenter } from "./getDataForSwappingAPlanPresenter";

export const getDataForSwappingAPlan: GetDataForSwappingAPlan = new GetDataForSwappingAPlan(
    mongooseSubscriptionRepository,
    mongoosePlanRepository
);
export const getDataForSwappingAPlanPresenter: GetDataForSwappingAPlanPresenter = new GetDataForSwappingAPlanPresenter();
export const getDataForSwappingAPlanController: GetDataForSwappingAPlanController = new GetDataForSwappingAPlanController(
    getDataForSwappingAPlan,
    getDataForSwappingAPlanPresenter
);
