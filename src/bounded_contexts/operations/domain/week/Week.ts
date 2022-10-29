import { Entity } from "../../../../core/domain/Entity";
import { Guard } from "../../../../core/logic/Guard";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Locale } from "../locale/Locale";
import { WeekId } from "./WeekId";

export class Week extends Entity<Week> {
    private _minDay: Date;
    private _maxDay: Date;

    constructor(minDay: Date, maxDay: Date, id?: WeekId) {
        super(id);
        this._minDay = minDay;
        this._maxDay = maxDay;
    }

    public static create(minDay: Date, maxDay: Date, id?: WeekId): Week {
        const guardedProps = [
            { argument: minDay, argumentName: "Día mínimo" },
            { argument: maxDay, argumentName: "Día máximo" },
        ];
        const guardResult = Guard.againstNullOrUndefinedOrEmptyBulk(guardedProps);

        if (!guardResult.succeeded) throw new Error(guardResult.message);
        if (!MomentTimeService.isWeek(minDay, maxDay)) throw new Error("La semana ingresada no es válida");

        return new Week(minDay, maxDay, id);
    }

    public containsDate(aDate: Date): boolean {
        return this.minDay.getTime() <= aDate.getTime() && this.maxDay.getTime() >= aDate.getTime();
    }

    public getLabel(locale: Locale): string {
        return MomentTimeService.getHumanWeekRangeLabel(this.minDay, this.maxDay, locale);
    }

    public getShorterLabel(): string {
        return MomentTimeService.getShorterHumanWeekRangeLabel(this.minDay, this.maxDay);
    }

    public isPreviousWeekOf(aWeek: Week): boolean {
        const auxDate: Date = new Date(aWeek.minDay);
        auxDate.setDate(auxDate.getDate() - 7);

        return this.minDay.getTime() === auxDate.getTime();
    }

    public isTheNextWeekAfter(aWeek: Week): boolean {
        const auxDate: Date = new Date(this.minDay);
        auxDate.setDate(auxDate.getDate() + 7);

        return aWeek.minDay.getTime() === auxDate.getTime();
    }

    /**
     * Getter minDay
     * @return {Date}
     */
    public get minDay(): Date {
        return this._minDay;
    }

    /**
     * Getter maxDay
     * @return {Date}
     */
    public get maxDay(): Date {
        return this._maxDay;
    }

    /**
     * Setter minDay
     * @param {Date} value
     */
    public set minDay(value: Date) {
        this._minDay = value;
    }

    /**
     * Setter maxDay
     * @param {Date} value
     */
    public set maxDay(value: Date) {
        this._maxDay = value;
    }
}
