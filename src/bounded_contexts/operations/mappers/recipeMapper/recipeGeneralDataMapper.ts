import { Mapper } from "../../../../core/infra/Mapper";
import { Locale } from "../../domain/locale/Locale";
import { RecipeCookDuration } from "../../domain/recipe/RecipeGeneralData/RecipeCookDuration";
import { RecipeDescription } from "../../domain/recipe/RecipeGeneralData/RecipeDescription";
import { RecipeGeneralData } from "../../domain/recipe/RecipeGeneralData/RecipeGeneralData";
import { RecipeSku } from "../../domain/recipe/RecipeGeneralData/RecipeSku";
import { RecipeWeight } from "../../domain/recipe/RecipeGeneralData/RecipeWeight";

export class RecipeGeneralDataMapper implements Mapper<RecipeGeneralData> {
    public toDomain(raw: any, locale: Locale = Locale.es): RecipeGeneralData {
        const recipeDescription: RecipeDescription = new RecipeDescription(
            raw.recipeDescription.shortDescription[locale],
            raw.recipeDescription.longDescription[locale]
        );
        const cookDuration: RecipeCookDuration = new RecipeCookDuration(raw.recipeCookDuration.timeValue);
        const recipeWeight: RecipeWeight = new RecipeWeight(raw.recipeWeight.weightValue, raw.recipeWeight.weightUnit);

        return new RecipeGeneralData(
            raw.name[locale],
            recipeDescription,
            cookDuration,
            raw.difficultyLevel,
            recipeWeight,
            new RecipeSku(raw.sku),
            raw.imagesUrls
        );
    }
    public toPersistence(t: RecipeGeneralData, locale: Locale = Locale.es) {
        return {
            name: { [locale]: t.name },
            recipeDescription: {
                shortDescription: { [locale]: t.recipeDescription.shortDescription },
                longDescription: { [locale]: t.recipeDescription.longDescription },
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
            imagesUrls: t.imagesUrls,
            difficultyLevel: t.difficultyLevel,
        };
    }
}
