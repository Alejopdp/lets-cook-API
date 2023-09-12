import { CouponApplicationType } from "../../domain/cupons/CouponApplicationType";
import { MaxChargeQtyType } from "../../domain/cupons/CouponMaxChargeQtyType";
import { CouponRequirementType } from "../../domain/cupons/CouponRequirementType";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";

export interface CouponToCreate {
    couponCode: string;
    discountType: string;
    discountValue: number;
    minRequireType: CouponRequirementType;
    minRequireValue: number;
    productsForApplyingType: CouponApplicationType;
    productsForApplyingValue: string[];
    limites: ILimitAplication[];
    maxChargeQtyType: MaxChargeQtyType;
    maxChargeQtyValue: number;
    startDate: Date;
    endDate?: Date;
    state: string;
}
export interface CreateManyCouponsDto {
    couponsToCreate: CouponToCreate[];
}
