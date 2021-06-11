import { IngredientMapper } from "./ingredientMapper";
import { PlanMapper } from "./planMapper";
import { PlanVariantMapper } from "./planVariantMapper";
import { WeekMapper } from "./weekMapper";

export const planMapper: PlanMapper = new PlanMapper();
export const planVariantMapper: PlanVariantMapper = new PlanVariantMapper();
export const weekMapper: WeekMapper = new WeekMapper();
export const ingredientMapper: IngredientMapper = new IngredientMapper();
