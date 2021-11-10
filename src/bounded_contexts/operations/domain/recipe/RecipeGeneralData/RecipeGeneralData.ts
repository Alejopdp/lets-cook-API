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
    private _imagesUrls: string[];

    constructor(
        name: string,
        recipeDescription: RecipeDescription,
        cookDuration: RecipeCookDuration,
        difficultyLevel: RecipeDifficultyLevel,
        recipeWeight: RecipeWeight,
        recipeSku: RecipeSku,
        imagesUrls: string[]
    ) {
        this._name = name;
        this._recipeDescription = recipeDescription;
        this._cookDuration = cookDuration;
        this._difficultyLevel = difficultyLevel;
        this._recipeWeight = recipeWeight;
        this._recipeSku = recipeSku;
        this._imagesUrls = imagesUrls;
    }

    public equals(aRecipeGeneralData: RecipeGeneralData): boolean {
        return (
            this.name === aRecipeGeneralData.name &&
            this.recipeDescription.equals(aRecipeGeneralData.recipeDescription) &&
            this.cookDuration.equals(aRecipeGeneralData.cookDuration) &&
            this.difficultyLevel === aRecipeGeneralData.difficultyLevel &&
            this.recipeWeight.equals(aRecipeGeneralData.recipeWeight) &&
            this.recipeSku.equals(aRecipeGeneralData.recipeSku) &&
            this.imagesUrls === aRecipeGeneralData.imagesUrls
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
     * Getter imagesUrls
     * @return {string[]}
     */
    public get imagesUrls(): string[] {
        return this._imagesUrls;
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
     * Setter imagesUrls
     * @param {string[]} value
     */
    public set imagesUrls(value: string[]) {
        this._imagesUrls = value;
    }
}
