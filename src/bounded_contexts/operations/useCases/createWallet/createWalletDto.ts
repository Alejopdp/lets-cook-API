import { Locale } from "../../domain/locale/Locale";

export type CreateWalletDto = {
    amountToCharge: number;
    paymentMethodForCharging: string;
    customerId: string;
    datesOfCharge: { dayNumber: number, hour: string, minute: string }[];
    locale: Locale
}