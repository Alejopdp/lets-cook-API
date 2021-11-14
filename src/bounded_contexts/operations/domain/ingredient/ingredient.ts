import { IValueObject } from "../../../../core/domain/ValueObject";
import { IngredientId } from "./ingredientId";

export class Ingredient implements IValueObject<Ingredient> {
    private _name: string;
    private _id: IngredientId;

    constructor(name: string, id?: string | number) {
        this._name = name;
        this._id = id ? new IngredientId(id) : new IngredientId();
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

    /**
     * Getter id
     * @return {IngredientId}
     */
    public get id(): IngredientId {
        return this._id;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }
}
