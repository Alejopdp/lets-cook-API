import { IValueObject } from "../../../../core/domain/ValueObject";
import { Locale } from "../locale/Locale";
import { dayTranslations } from "./DayTranslations";

export class Day implements IValueObject<Day> {
    private _dayNumberOfWeek: number;

    constructor(dayNumberOfWeek: number) {
        this._dayNumberOfWeek = dayNumberOfWeek;
    }

    public equals(aDay: Day): boolean {
        return aDay.dayNumberOfWeek === this.dayNumberOfWeek;
    }

    public getDayName(locale?: Locale): string {
        // @ts-ignore
        return dayTranslations[this.dayNumberOfWeek][locale || Locale.es];
    }

    /**
     * Getter dayNumberOfWeek
     * @return {number}
     */
    public get dayNumberOfWeek(): number {
        return this._dayNumberOfWeek;
    }
}
