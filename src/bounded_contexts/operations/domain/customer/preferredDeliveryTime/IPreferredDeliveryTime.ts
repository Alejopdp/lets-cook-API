import { Locale } from "../../locale/Locale";
export interface IPreferredDeliveryTime {
    // _value: string;
    getLabel(locale: Locale): string;
    value(): string;
}
