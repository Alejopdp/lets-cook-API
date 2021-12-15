import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { GetActualWeekRecipes } from "./getActualWeekRecipes";
import { GetActualWeekRecipesController } from "./getActualWeekRecipesController";
import { GetActualWeekRecipesPresenter } from "./getActualWeekRecipesPresenter";

export const getActualWeekRecipes: GetActualWeekRecipes = new GetActualWeekRecipes(mongooseWeekRepository, mongooseRecipeRepository);
export const getActualWeekRecipesPresenter: GetActualWeekRecipesPresenter = new GetActualWeekRecipesPresenter();
export const getActualWeekRecipesController: GetActualWeekRecipesController = new GetActualWeekRecipesController(
    getActualWeekRecipes,
    getActualWeekRecipesPresenter
);
