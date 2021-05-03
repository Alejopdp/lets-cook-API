import { IValueObject } from "../../../../core/domain/ValueObject";

export class RecipeTag implements IValueObject<RecipeTag> {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    public equals(aRecipeTag: RecipeTag): boolean {
        return this.name === aRecipeTag.name;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }
}
