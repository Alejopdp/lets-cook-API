import { Entity } from "../../../../../core/domain/Entity";
import { Ingredient } from "../../ingredient/ingredient";
import { RecipeVariantSku } from "./RecipeVariantSku";
import { RecipeVariantId } from "./RecipeVariantId";
import * as _ from "lodash";
import { RecipeVariantRestriction } from "./recipeVariantResitriction/RecipeVariantRestriction";

export class RecipeVariant extends Entity<RecipeVariant> {
    private _ingredients: Ingredient[];
    private _restriction: RecipeVariantRestriction;
    private _sku: RecipeVariantSku;

    constructor(ingredients: Ingredient[], restriction: RecipeVariantRestriction, sku: RecipeVariantSku, id?: RecipeVariantId) {
        super(id);
        if (!!!restriction) throw new Error("Es obligatorio indicar una restricción a todas las variantes");
        this._ingredients = _.uniqBy(ingredients, (ing) => ing.name);
        this._restriction = restriction;
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
     * Getter restriction
     * @return {RecipeVariantRestriction}
     */
    public get restriction(): RecipeVariantRestriction {
        return this._restriction;
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
     * Setter restriction
     * @param {RecipeVariantRestriction} value
     */
    public set restriction(value: RecipeVariantRestriction) {
        this._restriction = value;
    }

    /**
     * Setter sku
     * @param {RecipeVariantSku} value
     */
    public set sku(value: RecipeVariantSku) {
        this._sku = value;
    }
}
