export type CreateWalletDto = {
    amountToCharge: number;
    paymentMethodForChargingId: string;
    customerId: string;
    datesOfCharge: { dayNumber: number, hour: string, minute: string }[];

}