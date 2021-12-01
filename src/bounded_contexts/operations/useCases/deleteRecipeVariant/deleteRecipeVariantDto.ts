import { Locale } from "../../domain/locale/Locale";

export interface DeleteRecipeVariantDto {
    recipeVariantSku: string;
    locale: Locale;
}
