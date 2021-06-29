import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetDataForSwappingAPlan } from "./getDataForSwappingAPlan";
import { GetDataForSwappingAPlanController } from "./getDataForSwappingAPlanController";
import { GetDataForSwappingAPlanPresenter } from "./getDataForSwappingAPlanPresenter";

export const getDataForSwappingAPlan: GetDataForSwappingAPlan = new GetDataForSwappingAPlan(mongoosePlanRepository);
export const getDataForSwappingAPlanPresenter: GetDataForSwappingAPlanPresenter = new GetDataForSwappingAPlanPresenter();
export const getDataForSwappingAPlanController: GetDataForSwappingAPlanController = new GetDataForSwappingAPlanController(
    getDataForSwappingAPlan,
    getDataForSwappingAPlanPresenter
);
