import { Entity } from "../../../../../core/domain/Entity";
import { Ingredient } from "../../ingredient/ingredient";
import { RecipeVariantRestriction } from "./RecipeVariantRestriction";
import { RecipeVariantSku } from "./RecipeVariantSku";
import { RecipeVariantId } from "./RecipeVariantId";
import * as _ from "lodash";

export class RecipeVariant extends Entity<RecipeVariant> {
    private _ingredients: Ingredient[];
    private _recipeVariantRestriction: RecipeVariantRestriction[];
    private _sku: RecipeVariantSku;

    constructor(
        ingredients: Ingredient[],
        recipeVariantRestriction: RecipeVariantRestriction[],
        sku: RecipeVariantSku,
        id?: RecipeVariantId
    ) {
        super(id);
        this._ingredients = _.uniqBy(ingredients, (ing) => ing.name);
        this._recipeVariantRestriction = recipeVariantRestriction;
        this._sku = sku;
    }

    /**
     * Getter ingredients
     * @return {Ingredient[]}
     */
    public get ingredients(): Ingredient[] {
        return this._ingredients;
    }

    /**
     * Getter recipeVariantRestriction
     * @return {RecipeVariantRestriction[]}
     */
    public get recipeVariantRestriction(): RecipeVariantRestriction[] {
        return this._recipeVariantRestriction;
    }

    /**
     * Getter sku
     * @return {RecipeVariantSku}
     */
    public get sku(): RecipeVariantSku {
        return this._sku;
    }

    /**
     * Setter ingredients
     * @param {Ingredient[]} value
     */
    public set ingredients(value: Ingredient[]) {
        this._ingredients = value;
    }

    /**
     * Setter recipeVariantRestriction
     * @param {RecipeVariantRestriction[]} value
     */
    public set recipeVariantRestriction(value: RecipeVariantRestriction[]) {
        this._recipeVariantRestriction = value;
    }

    /**
     * Setter sku
     * @param {RecipeVariantSku} value
     */
    public set sku(value: RecipeVariantSku) {
        this._sku = value;
    }
}
