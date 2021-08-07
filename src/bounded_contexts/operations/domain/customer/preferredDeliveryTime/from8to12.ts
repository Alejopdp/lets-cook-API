import { Locale } from "../../locale/Locale";
import { IPreferredDeliveryTime } from "./IPreferredDeliveryTime";

export class From8To12 implements IPreferredDeliveryTime {
    private _value: string;

    constructor(value: string) {
        this._value = value;
    }

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

    /**
     * Getter value
     * @return {string}
     */
    public get value(): string {
        return this._value;
    }
}
