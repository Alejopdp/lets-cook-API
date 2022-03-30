import { MomentTimeService } from "@src/bounded_contexts/operations/application/timeService/momentTimeService";
import { Locale } from "../../locale/Locale";
import { IPlanFrequency } from "./IPlanFrequency";

export class BiweeklyFrequency implements IPlanFrequency {
    private _offset: number;

    constructor() {
        this._offset = 14;
    }

    public getNDatesWithFrequencyOffset(qtyOfDates: number, baseDate: Date): Date[] {
        const dates: Date[] = [baseDate];
        const auxDateForCalculatingRestOfDates: Date = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());

        for (let i = 1; i < qtyOfDates; i++) {
            auxDateForCalculatingRestOfDates.setDate(auxDateForCalculatingRestOfDates.getDate() + this.offset);

            dates.push(new Date(auxDateForCalculatingRestOfDates.toString()));
        }

        return dates;
    }

    public equals(aPlanFrequency: IPlanFrequency): boolean {
        return aPlanFrequency.value() === this.value();
    }

    public getLabel(locale: Locale = Locale.es): string {
        switch (locale) {
            case Locale.es:
                return "Cada 2 semanas";
            case Locale.en:
                return "Every 2 weeks";
            case Locale.ca:
                return "Cada 2 semanas";
            default:
                throw new Error("Idioma no valido para la frecuencia");
        }
    }

    public getNumberOfDays(): number {
        return 14;
    }

    public value(): string {
        return "biweekly";
    }

    public isOneTime(): boolean {
        return false;
    }
    public isWeekly(): boolean {
        return false;
    }
    public isBiweekly(): boolean {
        return true;
    }
    public isMonthly(): boolean {
        return false;
    }

    /**
     * Getter offset
     * @return {number}
     */
    public get offset(): number {
        return this._offset;
    }

    /**
     * Setter offset
     * @param {number} value
     */
    public set offset(value: number) {
        this._offset = value;
    }
}
