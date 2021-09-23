import { RecipeVariantRestriction } from "./RecipeVariantRestriction";

export class RestrictionCodeFactory {
    public static createCode(restrictionValue?: string): string {
        switch (restrictionValue) {
            case "sinGluten":
                return "GL";
            case "sinLactosa":
                return "LA";
            case "vegano":
                return "VE";
            case "Sin gluten y lactosa":
                return "LG";
            case "Apto vegano sin gluten":
                return "VG";
            case "apto_todo":
                return "";
            default:
                return "";
        }
    }
}
