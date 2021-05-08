import { Locale } from "../../domain/locale/Locale";

export interface GetPlanByIdDto {
    planId: string | number;
    locale: Locale;
}
