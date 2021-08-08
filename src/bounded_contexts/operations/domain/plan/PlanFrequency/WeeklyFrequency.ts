import { Locale } from "../../locale/Locale";
import { IPlanFrequency } from "./IPlanFrequency";

export class WeeklyFrequency implements IPlanFrequency {
    public equals(aPlanFrequency: IPlanFrequency): boolean {
        return aPlanFrequency.value() === this.value();
    }

    public getLabel(locale: Locale): string {
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
}
