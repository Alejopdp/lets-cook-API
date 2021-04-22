import { IValueObject } from "../../../../core/domain/ValueObject";

export class Ingredient implements IValueObject<Ingredient> {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    public equals(anIngredient: Ingredient): boolean {
        return this.name === anIngredient.name;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }
}
