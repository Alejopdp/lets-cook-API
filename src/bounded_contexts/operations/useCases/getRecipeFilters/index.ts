import { mockPlanRepository, mongoosePlanRepository } from "../../infra/repositories/plan";
import { mockRecipeRepository } from "../../infra/repositories/recipe";
import { mockWeekRepository } from "../../infra/repositories/week";
import { GetRecipeFilters } from "./getRecipeFilters";
import { GetRecipeFiltersControllers } from "./getRecipeFiltersController";

export const getRecipeFilters: GetRecipeFilters = new GetRecipeFilters(mockWeekRepository, mongoosePlanRepository, mockRecipeRepository);
export const getRecipeFiltersController: GetRecipeFiltersControllers = new GetRecipeFiltersControllers(getRecipeFilters);
