import { Locale } from "../../locale/Locale";
import { IPlanFrequency } from "./IPlanFrequency";

export class MonthlyFrequency implements IPlanFrequency {
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
}
