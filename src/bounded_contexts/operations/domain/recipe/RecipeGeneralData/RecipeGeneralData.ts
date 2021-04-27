import { IValueObject } from "../../../../../core/domain/ValueObject";
import { RecipeCookDuration } from "./RecipeCookDuration";
import { RecipeDescription } from "./RecipeDescription";
import { RecipeDifficultyLevel } from "./RecipeDifficultyLevel";
import { RecipeSku } from "./RecipeSku";
import { RecipeWeight } from "./RecipeWeight";

export class RecipeGeneralData implements IValueObject<RecipeGeneralData> {
    private _name: string;
    private _recipeDescription: RecipeDescription;
    private _cookDuration: RecipeCookDuration;
    private _difficultyLevel: RecipeDifficultyLevel;
    private _recipeWeight: RecipeWeight;
    private _recipeSku: RecipeSku;
    private _imageUrl: string;

    constructor(
        name: string,
        recipeDescription: RecipeDescription,
        cookDuration: RecipeCookDuration,
        difficultyLevel: RecipeDifficultyLevel,
        recipeWeight: RecipeWeight,
        recipeSku: RecipeSku,
        imageUrl: string
    ) {
        this._name = name;
        this._recipeDescription = recipeDescription;
        this._cookDuration = cookDuration;
        this._difficultyLevel = difficultyLevel;
        this._recipeWeight = recipeWeight;
        this._recipeSku = recipeSku;
        this._imageUrl = imageUrl;
    }

    public equals(aRecipeGeneralData: RecipeGeneralData): boolean {
        return (
            this.name === aRecipeGeneralData.name &&
            this.recipeDescription.equals(aRecipeGeneralData.recipeDescription) &&
            this.cookDuration.equals(aRecipeGeneralData.cookDuration) &&
            this.difficultyLevel === aRecipeGeneralData.difficultyLevel &&
            this.recipeWeight.equals(aRecipeGeneralData.recipeWeight) &&
            this.recipeSku.equals(aRecipeGeneralData.recipeSku) &&
            this.imageUrl === aRecipeGeneralData.imageUrl
        );
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter recipeDescription
     * @return {RecipeDescription}
     */
    public get recipeDescription(): RecipeDescription {
        return this._recipeDescription;
    }

    /**
     * Getter cookDuration
     * @return {RecipeCookDuration}
     */
    public get cookDuration(): RecipeCookDuration {
        return this._cookDuration;
    }

    /**
     * Getter difficultyLevel
     * @return {RecipeDifficultyLevel}
     */
    public get difficultyLevel(): RecipeDifficultyLevel {
        return this._difficultyLevel;
    }

    /**
     * Getter recipeWeight
     * @return {RecipeWeight}
     */
    public get recipeWeight(): RecipeWeight {
        return this._recipeWeight;
    }

    /**
     * Getter recipeSku
     * @return {RecipeSku}
     */
    public get recipeSku(): RecipeSku {
        return this._recipeSku;
    }

    /**
     * Getter imageUrl
     * @return {string}
     */
    public get imageUrl(): string {
        return this._imageUrl;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter recipeDescription
     * @param {RecipeDescription} value
     */
    public set recipeDescription(value: RecipeDescription) {
        this._recipeDescription = value;
    }

    /**
     * Setter cookDuration
     * @param {RecipeCookDuration} value
     */
    public set cookDuration(value: RecipeCookDuration) {
        this._cookDuration = value;
    }

    /**
     * Setter difficultyLevel
     * @param {RecipeDifficultyLevel} value
     */
    public set difficultyLevel(value: RecipeDifficultyLevel) {
        this._difficultyLevel = value;
    }

    /**
     * Setter recipeWeight
     * @param {RecipeWeight} value
     */
    public set recipeWeight(value: RecipeWeight) {
        this._recipeWeight = value;
    }

    /**
     * Setter recipeSku
     * @param {RecipeSku} value
     */
    public set recipeSku(value: RecipeSku) {
        this._recipeSku = value;
    }
    /**
     * Setter imageUrl
     * @param {string} value
     */
    public set imageUrl(value: string) {
        this._imageUrl = value;
    }
}
