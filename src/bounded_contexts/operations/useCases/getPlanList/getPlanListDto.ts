import { Locale } from "../../domain/locale/Locale";

export interface GetPlanListDto {
    locale: Locale;
    query: {
        ["isActive"]?: boolean;
    };
}
