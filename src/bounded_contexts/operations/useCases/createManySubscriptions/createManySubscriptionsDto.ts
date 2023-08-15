import { Locale } from "../../domain/locale/Locale";
import { PlanFrequencyType } from "../../domain/plan/PlanFrequency/PlanFrequencyFactory";

export interface CreateManySubscriptionsDto {
    customerId: string | number;
    plans: { planId: string; frequency: PlanFrequencyType; variant: any }[];
    locale: Locale;
    stripePaymentMethodId?: string;
}
