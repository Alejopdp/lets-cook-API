import { IValueObject } from "../../../../core/domain/ValueObject";
import { Recipe } from "../recipe/Recipe";
import { RecipeVariantId } from "../recipe/RecipeVariant/RecipeVariantId";

export class RecipeSelection implements IValueObject<RecipeSelection> {
    private _recipe: Recipe;
    private _quantity: number;
    private _recipeVariantId: RecipeVariantId;

    constructor(recipe: Recipe, quantity: number, recipeVariantId: RecipeVariantId) {
        this._recipe = recipe;
        this._quantity = quantity;
        this._recipeVariantId = recipeVariantId;
    }

    public equals(aRecipeSelection: RecipeSelection): boolean {
        return aRecipeSelection.recipe.equals(this.recipe) && aRecipeSelection.quantity === this.quantity;
    }

    /**
     * Getter recipe
     * @return {Recipe}
     */
    public get recipe(): Recipe {
        return this._recipe;
    }

    /**
     * Getter quantity
     * @return {number}
     */
    public get quantity(): number {
        return this._quantity;
    }

    /**
     * Getter recipeVariantId
     * @return {RecipeVariantId}
     */
    public get recipeVariantId(): RecipeVariantId {
        return this._recipeVariantId;
    }

    /**
     * Setter recipe
     * @param {Recipe} value
     */
    public set recipe(value: Recipe) {
        this._recipe = value;
    }

    /**
     * Setter quantity
     * @param {number} value
     */
    public set quantity(value: number) {
        this._quantity = value;
    }

    /**
     * Setter recipeVariantId
     * @param {RecipeVariantId} value
     */
    public set recipeVariantId(value: RecipeVariantId) {
        this._recipeVariantId = value;
    }
}
