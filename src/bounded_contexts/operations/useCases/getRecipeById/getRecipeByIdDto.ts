import { Locale } from "../../domain/locale/Locale";

export interface GetRecipeByIdDto {
    recipeId: string | number;
    locale: Locale;
}
