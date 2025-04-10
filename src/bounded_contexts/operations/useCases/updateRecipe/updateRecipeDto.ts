import { ReadStream } from "fs";
import { Locale } from "../../domain/locale/Locale";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { NewVariant } from "../createRecipe/createRecipeDto";

export interface UpdateRecipeDto {
    recipeId: string | number;
    sku: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    cookTime: number;
    difficultyLevel: RecipeDifficultyLevel;
    weight: number;
    recipeImage?: ReadStream;
    // recipeImageExtension: string;
    imageTags: string[];
    nutritionalInfo: { key: string; value: string; id?: string }[];
    relatedPlans: number[] | string[];
    availableMonths: Month[];
    availableWeeksIds: string[] | number[];
    backOfficeTags: string[];
    tools: string[];
    variants: NewVariant[];
    orderPriority: number;
    recipeImages: { file: ReadStream; fileName: string }[];
    locale: Locale;
}
