import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";

export interface CouponToCreate {
    couponCode: string;
    discountType: string;
    discountValue: number;
    minRequireType: string;
    minRequireValue: number;
    productsForApplyingType: string;
    productsForApplyingValue: string[];
    limites: ILimitAplication[];
    maxChargeQtyType: string;
    maxChargeQtyValue: number;
    startDate: Date;
    endDate?: Date;
    state: string;
}
export interface CreateManyCouponsDto {
    couponsToCreate: CouponToCreate[];
}
