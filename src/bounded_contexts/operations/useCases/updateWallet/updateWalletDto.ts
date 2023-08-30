export type UpdateWalletDto = {
    amountToCharge: number;
    paymentMethodForCharging: string;
    customerId: string;
    isEnabled: boolean;
    datesOfCharge: { dayNumber: number, hour: string, minute: string }[];
}