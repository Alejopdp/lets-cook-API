import { ReadStream } from "fs";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";

export interface CreateRecipeDto {
    sku: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    cookTime: number;
    difficultyLevel: RecipeDifficultyLevel;
    weight: number;
    recipeImage: ReadStream;
    recipeImageExtension: string;
    imageTags: string[];
    nutritionalInfo: string[];
    relatedPlans: number[] | string[];
    availableWeeksIds: number[] | string[];
    availableMonths: Month[];
    backOfficeTags: string[];
    planIds: string[] | number[]
}
