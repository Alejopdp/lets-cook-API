import { Locale } from "../../domain/locale/Locale";

export interface GetShippingZoneByIdDto {
    id: string | number;
    locale: Locale
}