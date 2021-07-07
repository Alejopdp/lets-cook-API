import { AddressMapper } from "./addressMapper";
import { PersonalInfoMapper } from "./personalInfoMapper";
import { IngredientMapper } from "./ingredientMapper";
import { OrderMapper } from "./orderMapper";
import { PaymentOrderMapper } from "./paymentOrderMapper";
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
export const paymentOrderMapper: PaymentOrderMapper = new PaymentOrderMapper();
export const orderMapper: OrderMapper = new OrderMapper();
export const addressMapper: AddressMapper = new AddressMapper();
export const personalInfoMapper: PersonalInfoMapper = new PersonalInfoMapper();
