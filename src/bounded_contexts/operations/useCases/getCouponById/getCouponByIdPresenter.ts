import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Coupon } from "../../domain/cupons/Cupon";
import { PlanId } from "../../domain/plan/PlanId";

export class GetCouponByIdPresenter {
    public static present(coupon: Coupon): any {
        return {
            id: coupon.id.value,
            code: coupon.couponCode,
            discount_type: coupon.type,
            minimum_requirement: {
                type: coupon.minRequireType,
                value: coupon.minRequireValue,
            },
            apply_to: {
                type: coupon.productsForApplyingType,
                value: coupon.productsForApplyingValue.map((coupon: PlanId) => coupon.value),
            },
            limites: coupon.limites,
            coupons_by_subscription: {
                type: coupon.maxChargeQtyType,
                value: coupon.maxChargeQtyValue,
            },
            date_rage: {
                start: MomentTimeService.getDdMmYyyy(coupon.startDate),
                expire: coupon.endDate ? MomentTimeService.getDdMmYyyy(coupon.endDate) : undefined,
            },
            state: coupon.state,
            quantityApplied: coupon.quantityApplied,
            quantityOfCustomersWhoHaveApplied: coupon.getCustomersQuantityWhoHaveApplied(),
        };
    }
}
