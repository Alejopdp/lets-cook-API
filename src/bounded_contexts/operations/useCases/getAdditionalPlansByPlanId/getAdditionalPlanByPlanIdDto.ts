import { Locale } from "../../domain/locale/Locale";

export interface GetAdditionalPlanByPlanIdDto {
    planId: string;
    locale: Locale
}
