import { Locale } from "../../domain/locale/Locale";

export interface GetOrderByIdDto {
    orderId: string | number;
    locale: Locale;
}
