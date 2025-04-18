import { ReadStream } from "fs";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";

export interface NewVariant {
    ingredients: string[];
    restriction: string; // Its an ID
    sku: string;
}

export interface CreateRecipeDto {
    sku: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    cookTime: number;
    difficultyLevel: RecipeDifficultyLevel;
    weight: number;
    recipeImages: { file: ReadStream; fileName: string }[];
    // recipeImageExtension: string;
    imageTags: string[];
    nutritionalInfo: { key: string; value: string }[];
    availableWeeksIds: number[] | string[];
    availableMonths: Month[];
    backOfficeTags: string[];
    planIds: string[] | number[];
    variants: NewVariant[];
    tools: string[];
}
