import { mockIngredientRepository } from "../../infra/repositories/ingredient";
import { mockPlanRepository } from "../../infra/repositories/plan";
import { mockWeekRepository } from "../../infra/repositories/week";
import { GetDataForCreatingARecipe } from "./getDataForCreatingARecipe";
import { GetDataForCreatingARecipeController } from "./getDataForCreatingARecipeController";

export const getDataForCreatingARecipe: GetDataForCreatingARecipe = new GetDataForCreatingARecipe(
    mockPlanRepository,
    mockIngredientRepository,
    mockWeekRepository
);
export const getDataForCreatingARecipeController: GetDataForCreatingARecipeController = new GetDataForCreatingARecipeController(
    getDataForCreatingARecipe
);
