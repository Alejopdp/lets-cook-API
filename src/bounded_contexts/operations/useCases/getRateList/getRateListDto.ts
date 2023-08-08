import { Locale } from "../../domain/locale/Locale";

export interface GetRateListDto {
    customerId: string;
    locale: Locale;
    queryDate: Date
}
