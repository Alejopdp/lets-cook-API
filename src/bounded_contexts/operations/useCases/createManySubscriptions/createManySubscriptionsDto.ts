import { Locale } from "../../domain/locale/Locale";

export interface CreateManySubscriptionsDto {
    customerId: string | number;
    plans: { planId: string; frequency: string; variant: any }[];
    locale: Locale;
    stripePaymentMethodId?: string;
}
