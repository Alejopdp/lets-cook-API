import { Locale } from "../../locale/Locale";
import { IPlanFrequency } from "./IPlanFrequency";

export class BiweeklyFrequency implements IPlanFrequency {
    public equals(aPlanFrequency: IPlanFrequency): boolean {
        return aPlanFrequency.value() === this.value();
    }

    public getLabel(locale: Locale): string {
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
}
