import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { GetRecipeFilters } from "./getRecipeFilters";
import { GetRecipeFiltersControllers } from "./getRecipeFiltersController";

export const getRecipeFilters: GetRecipeFilters = new GetRecipeFilters(
    mongooseWeekRepository,
    mongoosePlanRepository,
    mongooseRecipeRepository
);
export const getRecipeFiltersController: GetRecipeFiltersControllers = new GetRecipeFiltersControllers(getRecipeFilters);
