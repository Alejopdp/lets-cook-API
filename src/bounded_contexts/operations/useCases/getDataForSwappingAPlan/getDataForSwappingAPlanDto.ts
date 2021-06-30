import { Locale } from "../../domain/locale/Locale";

export interface GetDataForSwappingAPlanDto {
    subscriptionId: string | number;
    locale: Locale;
}
