import { Locale } from "../../locale/Locale";
import { IPreferredDeliveryTime } from "./IPreferredDeliveryTime";

export class From19To22 implements IPreferredDeliveryTime {
    public getLabel(locale: Locale): string {
        switch (locale) {
            case Locale.es:
                return "de 19 a 22 hs";
            case Locale.en:
                return "7 to 10 pm";
            case Locale.ca:
                return "de 19 a 22 hs";
            default:
                throw new Error("Idioma no valido para el horario de preferencia de entrega");
        }
    }

    public value(): string {
        return "19 - 22";
    }
}
