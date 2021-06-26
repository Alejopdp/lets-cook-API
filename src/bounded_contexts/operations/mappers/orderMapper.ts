import { planMapper, weekMapper } from ".";
import { Mapper } from "../../../core/infra/Mapper";
import { Locale } from "../domain/locale/Locale";
import { Order } from "../domain/order/Order";
import { OrderId } from "../domain/order/OrderId";
import { IOrderState } from "../domain/order/orderState/IOrderState";
import { OrderStateFactory } from "../domain/order/orderState/OrderStateFactory";
import { Plan } from "../domain/plan/Plan";
import { PlanVariantId } from "../domain/plan/PlanVariant/PlanVariantId";
import { Recipe } from "../domain/recipe/Recipe";
import { RecipeVariantId } from "../domain/recipe/RecipeVariant/RecipeVariantId";
import { SubscriptionId } from "../domain/subscription/SubscriptionId";
import { Week } from "../domain/week/Week";
import { recipeMapper } from "./recipeMapper";

export class OrderMapper implements Mapper<Order> {
    public toDomain(raw: any, locale?: Locale): Order {
        const state: IOrderState = OrderStateFactory.createState(raw.state);
        const week: Week = weekMapper.toDomain(raw.week);
        const planVariantId: PlanVariantId = new PlanVariantId(raw.planVariantId);
        const plan: Plan = planMapper.toDomain(raw.plan, Locale.es);
        const subscriptionId: SubscriptionId = new SubscriptionId(raw.subscription);
        const recipeVariantsIds: RecipeVariantId[] = raw.recipeVariants.map((id: string) => new RecipeVariantId(id));
        const recipes: Recipe[] = raw.recipes.map((recipe: any) => recipeMapper.toDomain(recipe));

        return new Order(
            raw.shippingDate,
            state,
            raw.billingDate,
            week,
            planVariantId,
            plan,
            raw.price,
            subscriptionId,
            recipeVariantsIds,
            recipes,
            new OrderId(raw._id)
        );
    }

    public toPersistence(t: Order, locale?: Locale) {
        return {
            shippingDate: t.shippingDate,
            plan: t.plan.id.value,
            planVariant: t.planVariantId.value,
            state: t.state.title,
            billingDate: t.billingDate,
            week: t.week.id.value,
            price: t.price,
            subscription: t.subscriptionId.value,
            recipeVariants: t.recipesVariantsIds.map((id) => id.value),
            recipes: t.recipes.map((recipe) => recipe.id.value),
            _id: t.id.value,
        };
    }
}
