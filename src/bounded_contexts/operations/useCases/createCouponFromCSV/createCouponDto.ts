import { ReadStream } from "fs";
import { Locale } from "../../domain/locale/Locale";
import { PlanId } from "../../domain/plan/PlanId";
import { ICouponType } from "../../domain/cupons/CuponType/ICuponType";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";

export interface CreateCouponCSVDto {
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
    startDate: Date,
    endDate: Date;
    state: string;
}
