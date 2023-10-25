import { Locale } from "../../domain/locale/Locale";

export interface GetRecipeListDto {
    locale: Locale;
    dates?: string | string[];
}
