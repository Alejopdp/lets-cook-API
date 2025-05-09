import { CouponId } from "./../../domain/cupons/CouponId";
import { Coupon } from "./../../domain/cupons/Cupon";
import { Mapper } from "../../../../core/infra/Mapper";
import { ICouponType } from "../../domain/cupons/CuponType/ICuponType";
import { FixedPrice } from "../../domain/cupons/CuponType/FixedPrice";
import { FreeShipping } from "../../domain/cupons/CuponType/FreeShipping";
import { PercentPrice } from "../../domain/cupons/CuponType/PercentagePrice";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";
import { LimitQty } from "../../domain/cupons/LimitAplication/LimitQty";
import { FirstOrder } from "../../domain/cupons/LimitAplication/FirstOrder";
import { OnePerCustomer } from "../../domain/cupons/LimitAplication/OnePerCustomer";
import { PlanId } from "../../domain/plan/PlanId";
import { CustomerId } from "../../domain/customer/CustomerId";

export class CouponMapper implements Mapper<Coupon, any> {
    public toDomain(raw: any): Coupon {
        const type: ICouponType =
            raw.type.type === "fixed"
                ? new FixedPrice(raw.type.type, raw.type.value)
                : raw.type.type === "free"
                    ? new FreeShipping(raw.type.type, raw.type.value)
                    : new PercentPrice(raw.type.type, raw.type.value);
        const productsForApplying: PlanId[] = raw.productsForApplyingValue.map((id: string) => new PlanId(id));
        const limits: ILimitAplication[] = raw.limites.map((limit: any) =>
            limit.type === "limit_qty"
                ? new LimitQty(limit.type, limit.value)
                : limit.type === "first_order"
                    ? new FirstOrder(limit.type, limit.value)
                    : new OnePerCustomer(limit.type, limit.value)
        );

        return Coupon.create(
            raw.couponCode,
            type,
            raw.minRequireType,
            raw.minRequireValue,
            raw.productsForApplyingType,
            productsForApplying,
            limits,
            raw.maxChargeQtyType,
            raw.maxChargeQtyValue,
            raw.startDate,
            raw.state,
            raw.quantityApplied,
            raw.customersWhoHaveApplied.map((id: any) => new CustomerId(id)),
            raw.endDate,
            new CouponId(raw._id)
        );
    }
    public toPersistence(t: Coupon): any {
        // const variants: any[] = t.planVariants.map((variant) => planVariantMapper.toPersistence(variant));
        return {
            _id: t.id.value,
            couponCode: t.couponCode,
            type: t.type,
            minRequireType: t.minRequireType,
            minRequireValue: t.minRequireValue,
            productsForApplyingType: t.productsForApplyingType,
            productsForApplyingValue: t.productsForApplyingValue.map((planId) => planId.value),
            limites: t.limites,
            maxChargeQtyType: t.maxChargeQtyType,
            maxChargeQtyValue: t.maxChargeQtyValue,
            startDate: t.startDate,
            endDate: t.endDate,
            state: t.state,
            quantityApplied: t.quantityApplied,
            customersWhoHaveApplied: t.customersWhoHaveApplied,
        };
    }
}
