import { IValueObject } from "../../../../../core/domain/ValueObject";
import { WeightUnit } from "./WeightUnit";

export class RecipeWeight implements IValueObject<RecipeWeight> {
    private _weightValue: number;
    private _weightUnit: WeightUnit;

    constructor(weightValue: number, weightUnit: WeightUnit) {
        this._weightValue = weightValue;
        this._weightUnit = weightUnit;
    }

    public equals(aRecipeWeight: RecipeWeight): boolean {
        return this.weightValue === aRecipeWeight.weightValue && this.weightUnit === aRecipeWeight.weightUnit;
    }

    public value(): string {
        return `${this.weightValue}${this.weightUnit}`;
    }

    /**
     * Getter weightValue
     * @return {number}
     */
    public get weightValue(): number {
        return this._weightValue;
    }

    /**
     * Getter weightUnit
     * @return {WeightUnit}
     */
    public get weightUnit(): WeightUnit {
        return this._weightUnit;
    }

    /**
     * Setter weightValue
     * @param {number} value
     */
    public set weightValue(value: number) {
        this._weightValue = value;
    }

    /**
     * Setter weightUnit
     * @param {WeightUnit} value
     */
    public set weightUnit(value: WeightUnit) {
        this._weightUnit = value;
    }
}
