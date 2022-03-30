import { Locale } from "../../locale/Locale";
import { IPlanFrequency } from "./IPlanFrequency";

export class MonthlyFrequency implements IPlanFrequency {
    private _offset: number;

    constructor() {
        this._offset = 28;
    }

    public getNDatesWithFrequencyOffset(qtyOfDates: number, baseDate: Date): Date[] {
        const dates: Date[] = [baseDate];
        const auxDateForCalculatingRestOfDates: Date = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 10);

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
                return "Cada mes";
            case Locale.en:
                return "Every month";
            case Locale.ca:
                return "Cada mes";
            default:
                throw new Error("Idioma no valido para la frecuencia");
        }
    }

    public getNumberOfDays(): number {
        return 28;
    }

    public value(): string {
        return "monthly";
    }

    public isOneTime(): boolean {
        return false;
    }
    public isWeekly(): boolean {
        return false;
    }
    public isBiweekly(): boolean {
        return false;
    }
    public isMonthly(): boolean {
        return true;
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
