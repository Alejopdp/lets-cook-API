import { IValueObject } from "../../../../../core/domain/ValueObject";

export class RecipeSku implements IValueObject<RecipeSku> {
    private _code: string;

    constructor(code: string) {
        this._code = code;
    }

    public equals(aRecipeSku: RecipeSku): boolean {
        return this.code === aRecipeSku.code;
    }

    /**
     * Getter code
     * @return {string}
     */
    public get code(): string {
        return this._code;
    }

    /**
     * Setter code
     * @param {string} value
     */
    public set code(value: string) {
        this._code = value;
    }
}
