export type CreateWalletDto = {
    amountToCharge: number;
    paymentMethodForChargingId: string;
    customerId: string;
}