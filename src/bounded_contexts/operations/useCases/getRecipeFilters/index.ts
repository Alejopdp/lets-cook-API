import { mockPlanRepository } from "../../infra/repositories/plan";
import { mockRecipeRepository } from "../../infra/repositories/recipe";
import { mockWeekRepository } from "../../infra/repositories/week";
import { GetRecipeFilters } from "./getRecipeFilters";
import { GetRecipeFiltersControllers } from "./getRecipeFiltersController";

export const getRecipeFilters: GetRecipeFilters = new GetRecipeFilters(mockWeekRepository, mockPlanRepository, mockRecipeRepository);
export const getRecipeFiltersController: GetRecipeFiltersControllers = new GetRecipeFiltersControllers(getRecipeFilters);
