import { mongooseIngredientRepository } from "../../infra/repositories/ingredient";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseRecipeVariantRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { GetDataForCreatingARecipe } from "./getDataForCreatingARecipe";
import { GetDataForCreatingARecipeController } from "./getDataForCreatingARecipeController";

// export const getDataForCreatingARecipe: GetDataForCreatingARecipe = new GetDataForCreatingARecipe(
//     mongoosePlanRepository,
//     mockIngredientRepository,
//     mockWeekRepository,
//     mockRecipeRestrictionRepository
// );

export const getDataForCreatingARecipe: GetDataForCreatingARecipe = new GetDataForCreatingARecipe(
    mongoosePlanRepository,
    mongooseIngredientRepository,
    mongooseWeekRepository,
    mongooseRecipeVariantRestrictionRepository
);
export const getDataForCreatingARecipeController: GetDataForCreatingARecipeController = new GetDataForCreatingARecipeController(
    getDataForCreatingARecipe
);
