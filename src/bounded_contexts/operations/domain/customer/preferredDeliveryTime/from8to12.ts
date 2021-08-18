import { Locale } from "../../locale/Locale";
import { IPreferredDeliveryTime } from "./IPreferredDeliveryTime";

export class From8To12 implements IPreferredDeliveryTime {
    public getLabel(locale: Locale): string {
        switch (locale) {
            case Locale.es:
                return "De 8 a 12";
            case Locale.en:
                return "From 8 to 12";
            case Locale.ca:
                return "De 8 a 12";
            default:
                throw new Error("Idioma no valido para el horario de preferencia de entrega");
        }
    }

    public value(): string {
        return "8 - 12";
    }
}
