import { ReadStream } from "fs";
import { Locale } from "../../domain/locale/Locale";
import { PlanId } from "../../domain/plan/PlanId";
import { ICouponType } from "../../domain/cupons/CuponType/ICuponType";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";

export interface CreateShippingZoneDto {
    name: string;
    reference: string;
    cost: number;
    state: string;
    radio: any;
}
