import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { GetNextWeekRecipes } from "./getNextWeekRecipes";
import { GetNextWeekRecipesController } from "./getNextWeekRecipesController";
import { GetNextWeekRecipesPresenter } from "./getNextWeekRecipesPresenter";

export const getNextWeekRecipes: GetNextWeekRecipes = new GetNextWeekRecipes(mongooseWeekRepository, mongooseRecipeRepository);
export const getNextWeekRecipesPresenter: GetNextWeekRecipesPresenter = new GetNextWeekRecipesPresenter();
export const getNextWeekRecipesController: GetNextWeekRecipesController = new GetNextWeekRecipesController(
    getNextWeekRecipes,
    getNextWeekRecipesPresenter
);
