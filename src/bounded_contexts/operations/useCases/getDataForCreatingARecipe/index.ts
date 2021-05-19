import { mockIngredientRepository } from "../../infra/repositories/ingredient";
import { mockPlanRepository, mongoosePlanRepository } from "../../infra/repositories/plan";
import { mockRecipeRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction";
import { mockWeekRepository } from "../../infra/repositories/week";
import { GetDataForCreatingARecipe } from "./getDataForCreatingARecipe";
import { GetDataForCreatingARecipeController } from "./getDataForCreatingARecipeController";

export const getDataForCreatingARecipe: GetDataForCreatingARecipe = new GetDataForCreatingARecipe(
    mongoosePlanRepository,
    mockIngredientRepository,
    mockWeekRepository,
    mockRecipeRestrictionRepository
);
export const getDataForCreatingARecipeController: GetDataForCreatingARecipeController = new GetDataForCreatingARecipeController(
    getDataForCreatingARecipe
);
