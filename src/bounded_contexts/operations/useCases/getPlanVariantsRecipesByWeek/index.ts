import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { GetPlanVariantsRecipesByWeekList } from "./getPlanVariantsRecipesByWeekList";
import { GetPlanVariantsRecipesByWeekListController } from "./getPlanVariantsRecipesByWeekListController";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";

// export const getAdditionalPlanList: GetAdditionalPlanList = new GetAdditionalPlanList(mockPlanRepository);
export const getPlanVariantsRecipesByWeekList: GetPlanVariantsRecipesByWeekList = new GetPlanVariantsRecipesByWeekList(
    mongoosePlanRepository,
    mongooseRecipeRepository,
    mongooseWeekRepository
);
export const getPlanVariantsRecipesByWeekListController: GetPlanVariantsRecipesByWeekListController =
    new GetPlanVariantsRecipesByWeekListController(getPlanVariantsRecipesByWeekList);
