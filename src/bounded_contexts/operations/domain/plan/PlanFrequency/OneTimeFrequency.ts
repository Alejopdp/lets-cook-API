import { Locale } from "../../locale/Locale";
import { IPlanFrequency } from "./IPlanFrequency";

export class OneTimeFrequency implements IPlanFrequency {
    public equals(aPlanFrequency: IPlanFrequency): boolean {
        return aPlanFrequency.value() === this.value();
    }

    public getLabel(locale: Locale): string {
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
