import { Locale } from "../../domain/locale/Locale";

export interface GetPaymentOrderByIdDto {
    paymentOrderId: string | number;
    locale: Locale;
}
