import { IValueObject } from "../../../../../core/domain/ValueObject";

export class RecipeVariantSku implements IValueObject<RecipeVariantSku> {
    private _code: string;

    constructor(code: string) {
        if (!!!code) throw new Error("Es obligatorio ingresar un SKU para las variantes de las recetas");
        this._code = code;
    }

    public equals(aRecipeVariantSku: RecipeVariantSku): boolean {
        return this.code === aRecipeVariantSku.code;
    }

    /**
     * Getter code
     * @return {string}
     */
    public get code(): string {
        return this._code;
    }
}
