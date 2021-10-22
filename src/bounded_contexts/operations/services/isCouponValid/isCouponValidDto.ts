import { Coupon } from "../../domain/cupons/Cupon";
import { Plan } from "../../domain/plan/Plan";
import { PlanVariantId } from "../../domain/plan/PlanVariant/PlanVariantId";
import { Subscription } from "../../domain/subscription/Subscription";

export interface IsCouponValidDto {
    coupon: Coupon;
    plan: Plan;
    planVariantId: PlanVariantId;
    customerSubscriptions: Subscription[];
    shippingCost: number;
}
