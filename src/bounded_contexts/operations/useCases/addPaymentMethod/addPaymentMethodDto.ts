import { Locale } from "../../domain/locale/Locale";

export interface AddPaymentMethodDto {
    customerId: string;
    stripeId: string;
    locale: Locale;
}
