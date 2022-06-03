import { planMapper, recipeSelectionMapper, weekMapper } from ".";
import { Mapper } from "../../../core/infra/Mapper";
import { Customer } from "../domain/customer/Customer";
import { Locale } from "../domain/locale/Locale";
import { Order } from "../domain/order/Order";
import { OrderId } from "../domain/order/OrderId";
import { IOrderState } from "../domain/order/orderState/IOrderState";
import { OrderStateFactory } from "../domain/order/orderState/OrderStateFactory";
import { RecipeSelection } from "../domain/order/RecipeSelection";
import { PaymentOrderId } from "../domain/paymentOrder/PaymentOrderId";
import { Plan } from "../domain/plan/Plan";
import { PlanVariantId } from "../domain/plan/PlanVariant/PlanVariantId";
import { RecipeVariantId } from "../domain/recipe/RecipeVariant/RecipeVariantId";
import { SubscriptionId } from "../domain/subscription/SubscriptionId";
import { Week } from "../domain/week/Week";
import { customerMapper } from "./customerMapper";

export class OrderMapper implements Mapper<Order, any> {
    public toDomain(raw: any, locale: Locale = Locale.es): Order {
        const state: IOrderState = OrderStateFactory.createState(raw.state);
        const week: Week = weekMapper.toDomain(raw.week);
        const planVariantId: PlanVariantId = new PlanVariantId(raw.planVariant);
        const plan: Plan = planMapper.toDomain(raw.plan, locale);
        const subscriptionId: SubscriptionId = new SubscriptionId(raw.subscription);
        const recipeVariantsIds: RecipeVariantId[] = raw.recipeVariants.map((id: string) => new RecipeVariantId(id));
        const recipeSelection: RecipeSelection[] = raw.recipeSelection.map((selection: any) =>
            recipeSelectionMapper.toDomain(selection, locale)
        );
        const paymentOrderId: PaymentOrderId | undefined = raw.paymentOrder ? new PaymentOrderId(raw.paymentOrder) : undefined;
        const customer: Customer = customerMapper.toDomain(raw.customer);

        return new Order(
            raw.shippingDate,
            state,
            raw.billingDate,
            week,
            planVariantId,
            plan,
            raw.price / 100,
            raw.discountAmount / 100,
            raw.hasFreeShipping,
            subscriptionId,
            recipeVariantsIds,
            recipeSelection,
            raw.choseByAdmin,
            customer,
            raw.firstDateOfRecipesSelection,
            raw.lastDateOfRecipesSelection,
            paymentOrderId,
            new OrderId(raw._id),
            raw.createdAt,
            raw.counter,
            raw.isFirstOrderOfSubscription
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
            price: Math.round(t.price * 100),
            discountAmount: Math.round(t.discountAmount * 100),
            hasFreeShipping: t.hasFreeShipping,
            subscription: t.subscriptionId.value,
            recipeVariants: t.recipesVariantsIds.map((id) => id.value),
            recipeSelection: t.recipeSelection.map((selection) => ({ recipe: selection.recipe.id.value, quantity: selection.quantity })),
            choseByAdmin: t.choseByAdmin,
            firstDateOfRecipesSelection: t.firstDateOfRecipesSelection,
            lastDateOfRecipesSelection: t.lastDateOfRecipesSelection,
            paymentOrder: t.paymentOrderId?.value,
            _id: t.id.value,
            customer: t.customer.id.value,
            isFirstOrderOfSubscription: t.isFirstOrderOfSubscription,
        };
    }
}
