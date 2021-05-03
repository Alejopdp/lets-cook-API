import { IValueObject } from "../../../../../core/domain/ValueObject";

export class RecipeDescription implements IValueObject<RecipeDescription> {
    private _shortDescription: string;
    private _longDescription: string;

    constructor(shortDescription: string, longDescription: string) {
        this._shortDescription = shortDescription;
        this._longDescription = longDescription;
    }

    public equals(aRecipeDescription: RecipeDescription): boolean {
        return this.shortDescription === aRecipeDescription.shortDescription && this.longDescription === aRecipeDescription.longDescription;
    }

    /**
     * Getter shortDescription
     * @return {string}
     */
    public get shortDescription(): string {
        return this._shortDescription;
    }

    /**
     * Getter longDescription
     * @return {string}
     */
    public get longDescription(): string {
        return this._longDescription;
    }

    /**
     * Setter shortDescription
     * @param {string} value
     */
    public set shortDescription(value: string) {
        this._shortDescription = value;
    }

    /**
     * Setter longDescription
     * @param {string} value
     */
    public set longDescription(value: string) {
        this._longDescription = value;
    }
}
