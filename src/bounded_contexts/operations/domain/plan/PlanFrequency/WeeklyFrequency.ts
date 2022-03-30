import { Locale } from "../../locale/Locale";
import { IPlanFrequency } from "./IPlanFrequency";

export class WeeklyFrequency implements IPlanFrequency {
    private _offset: number;

    constructor() {
        this._offset = 7;
    }

    public getNDatesWithFrequencyOffset(qtyOfDates: number, baseDate: Date): Date[] {
        console.log("ENTRA ACA NO");
        const dates: Date[] = [baseDate];
        const auxDateForCalculatingRestOfDates: Date = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());

        for (let i = 1; i < qtyOfDates; i++) {
            auxDateForCalculatingRestOfDates.setDate(auxDateForCalculatingRestOfDates.getDate() + this.offset);

            dates.push(new Date(auxDateForCalculatingRestOfDates.getTime()));
        }

        return dates;
    }

    public equals(aPlanFrequency: IPlanFrequency): boolean {
        return aPlanFrequency.value() === this.value();
    }

    public getLabel(locale: Locale = Locale.es): string {
        switch (locale) {
            case Locale.es:
                return "Cada semana";
            case Locale.en:
                return "Every week";
            case Locale.ca:
                return "Cada semana";
            default:
                throw new Error("Idioma no valido para la frecuencia");
        }
    }

    public getNumberOfDays(): number {
        return 7;
    }

    public value(): string {
        return "weekly";
    }

    public isOneTime(): boolean {
        return false;
    }
    public isWeekly(): boolean {
        return true;
    }
    public isBiweekly(): boolean {
        return false;
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
