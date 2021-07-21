import { Locale } from "../../domain/locale/Locale";

export interface GetRecipesByRestrictionsDto {
    planId: string;
    restrictionId: string;
}
