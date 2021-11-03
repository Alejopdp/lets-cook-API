import { Locale } from "../../locale/Locale";
import { IPreferredDeliveryTime } from "./IPreferredDeliveryTime";

export class From17To20 implements IPreferredDeliveryTime {
    public getLabel(locale: Locale): string {
        switch (locale) {
            case Locale.es:
                return "de 17 a 20 hs";
            case Locale.en:
                return "5 to 8 pm";
            case Locale.ca:
                return "de 17 a 20 hs";
            default:
                throw new Error("Idioma no valido para el horario de preferencia de entrega");
        }
    }

    public value(): string {
        return "17 - 20";
    }
}
