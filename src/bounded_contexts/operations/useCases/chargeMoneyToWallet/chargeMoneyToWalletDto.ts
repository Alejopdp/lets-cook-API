import { Locale } from "../../domain/locale/Locale";

export type ChargeMoneyToWalletDto = {
    customerId: string;
    amountToCharge: number;
    paymentMethodId?: string;
    locale: Locale
}