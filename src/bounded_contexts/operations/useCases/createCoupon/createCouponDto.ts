import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";
import { CouponRequirementType } from "../../domain/cupons/CouponRequirementType";
import { CouponApplicationType } from "../../domain/cupons/CouponApplicationType";
import { MaxChargeQtyType } from "../../domain/cupons/CouponMaxChargeQtyType";

export interface CreateCouponDto {
    couponCode: string;
    discountType: string;
    discountValue: number;
    minRequireType: CouponRequirementType;
    minRequireValue: number;
    productsForApplyingType: CouponApplicationType;
    productsForApplyingValue?: string[];
    limites: ILimitAplication[];
    maxChargeQtyType: MaxChargeQtyType;
    maxChargeQtyValue: number;
    startDate: Date,
    endDate?: Date;
    state: string;
}
