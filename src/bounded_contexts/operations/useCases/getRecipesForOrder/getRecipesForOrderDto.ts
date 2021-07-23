import { Locale } from "../../domain/locale/Locale";

export interface GetRecipesForOrderDto {
    orderId: string;
    locale: Locale;
}
