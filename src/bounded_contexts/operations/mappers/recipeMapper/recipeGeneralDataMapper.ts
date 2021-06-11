import { Mapper } from "../../../../core/infra/Mapper";
import { Locale } from "../../domain/locale/Locale";
import { RecipeCookDuration } from "../../domain/recipe/RecipeGeneralData/RecipeCookDuration";
import { RecipeDescription } from "../../domain/recipe/RecipeGeneralData/RecipeDescription";
import { RecipeGeneralData } from "../../domain/recipe/RecipeGeneralData/RecipeGeneralData";
import { RecipeSku } from "../../domain/recipe/RecipeGeneralData/RecipeSku";
import { RecipeWeight } from "../../domain/recipe/RecipeGeneralData/RecipeWeight";

export class RecipeGeneralDataMapper implements Mapper<RecipeGeneralData> {
    public toDomain(raw: any, locale?: Locale): RecipeGeneralData {
        const recipeDescription: RecipeDescription = new RecipeDescription(
            raw.recipeDescription.shortDescription,
            raw.recipeDescription.longDescription
        );
        const cookDuration: RecipeCookDuration = new RecipeCookDuration(raw.recipeCookDuration.timeValue);
        const recipeWeight: RecipeWeight = new RecipeWeight(raw.recipeWeight.weightValue, raw.recipeWeight.weightUnit);

        return new RecipeGeneralData(
            raw.name,
            recipeDescription,
            cookDuration,
            raw.difficultyLevel,
            recipeWeight,
            new RecipeSku(raw.sku),
            raw.imageUrl
        );
    }
    public toPersistence(t: RecipeGeneralData, locale?: Locale) {
        return {
            name: t.name,
            recipeDescription: {
                shortDescription: t.recipeDescription.shortDescription,
                longDescription: t.recipeDescription.longDescription,
            },
            recipeCookDuration: {
                timeValue: t.cookDuration.timeValue,
                timeUnit: t.cookDuration.timeUnit,
            },
            recipeWeight: {
                weightValue: t.recipeWeight.weightValue,
                weightUnit: t.recipeWeight.weightUnit,
            },
            sku: t.recipeSku.code,
            imageUrl: t.imageUrl,
            difficultyLevel: t.difficultyLevel,
        };
    }
}
