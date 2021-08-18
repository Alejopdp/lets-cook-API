import { Locale } from "../../locale/Locale";
import { IPreferredDeliveryTime } from "./IPreferredDeliveryTime";

export class From12To16 implements IPreferredDeliveryTime {
    public getLabel(locale: Locale): string {
        switch (locale) {
            case Locale.es:
                return "De 12 a 16";
            case Locale.en:
                return "From 12 to 16";
            case Locale.ca:
                return "De 12 a 16";
            default:
                throw new Error("Idioma no valido para el horario de preferencia de entrega");
        }
    }

    public value(): string {
        return "12 - 16";
    }
}
