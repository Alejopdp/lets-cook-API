import { planMapper, weekMapper } from ".";
import { Mapper } from "../../../core/infra/Mapper";
import { Locale } from "../domain/locale/Locale";
import { Order } from "../domain/Order/Order";
import { OrderId } from "../domain/order/OrderId";
import { IOrderState } from "../domain/order/OrderState/IOrderState";
import { OrderStateFactory } from "../domain/order/OrderState/OrderStateFactory";
import { Plan } from "../domain/plan/Plan";
import { PlanVariantId } from "../domain/plan/PlanVariant/PlanVariantId";
import { Week } from "../domain/week/Week";

export class OrderMapper implements Mapper<Order> {
    public toDomain(raw: any, locale?: Locale): Order {
        const state: IOrderState = OrderStateFactory.createState(raw.state);
        const week: Week = weekMapper.toDomain(raw.week);
        const planVariantId: PlanVariantId = new PlanVariantId(raw.planVariantId);
        const plan: Plan = planMapper.toDomain(raw.plan, Locale.es);

        return new Order(raw.shippingDate, state, raw.billingDate, week, planVariantId, plan, raw.price, new OrderId(raw._id));
    }

    public toPersistence(t: Order, locale?: Locale) {
        return {
            shippingDate: t.shippingDate,
            state: t.state.title,
            billingDate: t.billingDate,
            week: t.week.id.value,
            amount: t.price,
            _id: t.id.value,
        };
    }
}
