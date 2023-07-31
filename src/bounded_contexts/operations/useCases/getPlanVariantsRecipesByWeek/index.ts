import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetPlanVariantsRecipesByWeekList } from "./getPlanVariantsRecipesByWeekList";
import { GetPlanVariantsRecipesByWeekListController } from "./getPlanVariantsRecipesByWeekListController";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { GetPlanVariantsRecipesByWeekListPresenter } from "./getPlanVariantsRecipesByWeekListPresenter";
import { v3S3Service } from "../../application/storageService";

export const getPlanVariantsRecipesByWeekList: GetPlanVariantsRecipesByWeekList = new GetPlanVariantsRecipesByWeekList(
    mongoosePlanRepository,
    mongooseRecipeRepository,
    mongooseWeekRepository
);
export const getPlanVariantsRecipesByWeekListPresenter: GetPlanVariantsRecipesByWeekListPresenter =
    new GetPlanVariantsRecipesByWeekListPresenter(v3S3Service);
export const getPlanVariantsRecipesByWeekListController: GetPlanVariantsRecipesByWeekListController =
    new GetPlanVariantsRecipesByWeekListController(getPlanVariantsRecipesByWeekList, getPlanVariantsRecipesByWeekListPresenter);
