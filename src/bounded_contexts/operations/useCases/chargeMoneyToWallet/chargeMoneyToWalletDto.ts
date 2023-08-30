export type ChargeMoneyToWalletDto = {
    customerId: string;
    amountToCharge: number;
    paymentMethodId?: string;
}