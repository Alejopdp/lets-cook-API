import { Locale } from "../../locale/Locale";
import { IPlanFrequency } from "./IPlanFrequency";

export class OneTimeFrequency implements IPlanFrequency {
    public getNDatesWithFrequencyOffset(qtyOfDates: number, baseDate: Date): Date[] {
        throw new Error("No puedes mover la fecha de cobro de un plan de única vez");
    }
    public equals(aPlanFrequency: IPlanFrequency): boolean {
        return aPlanFrequency.value() === this.value();
    }

    public setDateUsingOffset(date: Date): void {
        return
    }
    public getLabel(locale: Locale = Locale.es): string {
        switch (locale) {
            case Locale.es:
                return "Por única vez";
            case Locale.en:
                return "One time";
            case Locale.ca:
                return "Por única vez";
            default:
                throw new Error("Idioma no valido para la frecuencia");
        }
    }
    public getNumberOfDays(): number {
        return 7;
    }

    public value(): string {
        return "one_time";
    }

    public isOneTime(): boolean {
        return true;
    }
    public isWeekly(): boolean {
        return false;
    }
    public isBiweekly(): boolean {
        return false;
    }
    public isMonthly(): boolean {
        return false;
    }
}
