import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { GetNextWeekRecipes } from "./getNextWeekRecipes";
import { GetNextWeekRecipesController } from "./getNextWeekRecipesController";
import { GetNextWeekRecipesPresenter } from "./getNextWeekRecipesPresenter";

export const getNextWeekRecipes: GetNextWeekRecipes = new GetNextWeekRecipes(mongooseRecipeRepository);
export const getNextWeekRecipesPresenter: GetNextWeekRecipesPresenter = new GetNextWeekRecipesPresenter();
export const getNextWeekRecipesController: GetNextWeekRecipesController = new GetNextWeekRecipesController(
    getNextWeekRecipes,
    getNextWeekRecipesPresenter
);
