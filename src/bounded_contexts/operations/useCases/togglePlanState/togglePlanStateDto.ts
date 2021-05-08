import { Locale } from "../../domain/locale/Locale";

export interface TogglePlanStateDto {
    planId: number | string;
    locale: Locale;
}
