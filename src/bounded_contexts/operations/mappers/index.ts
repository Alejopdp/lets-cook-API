import { IngredientMapper } from "./ingredientMapper";
import { PlanMapper } from "./planMapper";
import { PlanVariantMapper } from "./planVariantMapper";
import { RecipeRestrictionsMapper } from "./recipeRestrictionsMapper";
import { SubscriptionMapper } from "./subscriptionMapper/subscriptionMapper";
import { WeekMapper } from "./weekMapper";

export const planMapper: PlanMapper = new PlanMapper();
export const planVariantMapper: PlanVariantMapper = new PlanVariantMapper();
export const weekMapper: WeekMapper = new WeekMapper();
export const ingredientMapper: IngredientMapper = new IngredientMapper();
export const recipeRestrictionMapper: RecipeRestrictionsMapper = new RecipeRestrictionsMapper();
export const subscriptionMapper: SubscriptionMapper = new SubscriptionMapper();
