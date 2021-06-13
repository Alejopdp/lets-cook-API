import { Coupon } from "../../domain/cupons/Cupon";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantWithRecipe } from "../../domain/plan/PlanVariant/PlanVariantWithRecipes";

export class GetCouponListPresenter {
    public static present(coupons: Coupon[]): any {
        const presentedCoupons = [];

        for (let coupon of coupons) {
            presentedCoupons.push({
                id: coupon.id.value,
                code: coupon.couponCode,
                discount_type: coupon.type,
                minimum_requirement: {
                    type: coupon.minRequireType,
                    value: coupon.minRequireValue
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
                    start: coupon.startDate,
                    expire: coupon.endDate,
                },
                state: coupon.state
            });
        }

        return presentedCoupons;
    }
}
