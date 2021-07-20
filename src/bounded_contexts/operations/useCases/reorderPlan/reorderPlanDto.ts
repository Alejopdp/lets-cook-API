import { Locale } from "../../domain/locale/Locale";

export interface ReorderPlanDto {
    subscriptionId: string;
    locale: Locale;
}
