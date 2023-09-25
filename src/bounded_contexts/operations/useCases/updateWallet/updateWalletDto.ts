import { Locale } from "../../domain/locale/Locale";

export type UpdateWalletDto = {
    amountToCharge: number;
    paymentMethodForCharging: string;
    customerId: string;
    isEnabled: boolean;
    datesOfCharge: { dayNumber: number, hour: string, minute: string }[];
    locale: Locale
}