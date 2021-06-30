import { Entity } from "../../../../../core/domain/Entity";
import { Ingredient } from "../../ingredient/ingredient";
import { RecipeVariantSku } from "./RecipeVariantSku";
import { RecipeVariantId } from "./RecipeVariantId";
import * as _ from "lodash";
import { RecipeVariantRestriction } from "./recipeVariantResitriction/RecipeVariantRestriction";

export class RecipeVariant extends Entity<RecipeVariant> {
    private _ingredients: Ingredient[];
    private _recipeVariantRestrictions: RecipeVariantRestriction[];
    private _sku: RecipeVariantSku;

    constructor(
        ingredients: Ingredient[],
        recipeVariantRestrictions: RecipeVariantRestriction[],
        sku: RecipeVariantSku,
        id?: RecipeVariantId
    ) {
        super(id);
        this._ingredients = _.uniqBy(ingredients, (ing) => ing.name);
        this._recipeVariantRestrictions = recipeVariantRestrictions;
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
     * Getter recipeVariantRestrictions
     * @return {RecipeVariantRestriction[]}
     */
    public get recipeVariantRestrictions(): RecipeVariantRestriction[] {
        return this._recipeVariantRestrictions;
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
     * Setter recipeVariantRestrictions
     * @param {RecipeVariantRestriction[]} value
     */
    public set recipeVariantRestrictions(value: RecipeVariantRestriction[]) {
        this._recipeVariantRestrictions = value;
    }

    /**
     * Setter sku
     * @param {RecipeVariantSku} value
     */
    public set sku(value: RecipeVariantSku) {
        this._sku = value;
    }
}
