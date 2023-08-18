import { Locale } from "../../domain/locale/Locale";
import { PlanFrequencyType } from "../../domain/plan/PlanFrequency/PlanFrequencyFactory";

export interface CreateSubscriptionAsAdminDto {
    customerId: string;
    planFrequency: PlanFrequencyType;
    planId: string;
    planVariantId: string;
    locale: Locale;
    couponCode: string;
}
