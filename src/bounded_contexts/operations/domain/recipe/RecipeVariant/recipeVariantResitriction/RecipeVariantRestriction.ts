// export enum RecipeVariantRestriction {
//     SinGluten = "Sin Gluten",
//     SinLactosa = "Sin Lactosa",
//     Vegano = "Apto vegano",
//     Vegetariano = "Apto Vegetariano",
// }

import { Entity } from "../../../../../../core/domain/Entity";
import { RecipeRestrictionId } from "./recipeRestrictionId";

export class RecipeVariantRestriction extends Entity<RecipeVariantRestriction> {
    private _label: string;
    private _value: string;

    constructor(label: string, value: string, id?: RecipeRestrictionId) {
        super(id);
        this._label = label;
        this._value = value;
    }

    /**
     * Getter label
     * @return {string}
     */
    public get label(): string {
        return this._label;
    }

    /**
     * Getter value
     * @return {string}
     */
    public get value(): string {
        return this._value;
    }

    /**
     * Setter label
     * @param {string} value
     */
    public set label(value: string) {
        this._label = value;
    }

    /**
     * Setter value
     * @param {string} value
     */
    public set value(value: string) {
        this._value = value;
    }
}
