import { GetRecipesByRestrictions } from "./getRecipesByRestrictions";
import { GetRecipesByRestrictionsController } from "./getRecipesByRestrictionsController";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";

// export const getAdditionalPlanList: GetAdditionalPlanList = new GetAdditionalPlanList(mockPlanRepository);
export const getRecipesByRestrictions: GetRecipesByRestrictions = new GetRecipesByRestrictions(
    mongooseRecipeRepository
);
export const getRecipesByRestrictionsController: GetRecipesByRestrictionsController =
    new GetRecipesByRestrictionsController(getRecipesByRestrictions);
