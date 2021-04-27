import { IValueObject } from "../../../../../core/domain/ValueObject";
import { TimeUnit } from "./TimeUnit";

export class RecipeCookDuration implements IValueObject<RecipeCookDuration> {
    private _timeValue: number;
    private _timeUnit: TimeUnit;

    constructor(timeValue: number) {
        this._timeValue = timeValue;
        this._timeUnit = TimeUnit.Minute;
    }

    public equals(aRecipeCookDuration: RecipeCookDuration): boolean {
        return this.timeValue === aRecipeCookDuration.timeValue && this.timeUnit === aRecipeCookDuration.timeUnit;
    }

    public value(): string {
        return `${this.timeValue}${this.timeUnit}`;
    }

    /**
     * Getter timeValue
     * @return {number}
     */
    public get timeValue(): number {
        return this._timeValue;
    }

    /**
     * Getter timeUnit
     * @return {TimeUnit}
     */
    public get timeUnit(): TimeUnit {
        return this._timeUnit;
    }

    /**
     * Setter timeValue
     * @param {number} value
     */
    public set timeValue(value: number) {
        this._timeValue = value;
    }

    /**
     * Setter timeUnit
     * @param {TimeUnit} value
     */
    public set timeUnit(value: TimeUnit) {
        this._timeUnit = value;
    }
}
