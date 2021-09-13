import { Locale } from "../../locale/Locale";
import { IPreferredDeliveryTime } from "./IPreferredDeliveryTime";

export class From15To18 implements IPreferredDeliveryTime {
    public getLabel(locale: Locale): string {
        switch (locale) {
            case Locale.es:
                return "de 15 a 18 hs";
            case Locale.en:
                return "3 to 6 pm";
            case Locale.ca:
                return "de 15 a 18 hs";
            default:
                throw new Error("Idioma no valido para el horario de preferencia de entrega");
        }
    }

    public value(): string {
        return "15 - 18";
    }
}
