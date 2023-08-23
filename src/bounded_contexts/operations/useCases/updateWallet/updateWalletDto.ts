export type UpdateWalletDto = {
    amountToCharge: number;
    paymentMethodForChargingId: string;
    customerId: string;
    isEnabled: boolean;
    datesOfCharge: { dayNumber: number, hour: string, minute: string }[];
}