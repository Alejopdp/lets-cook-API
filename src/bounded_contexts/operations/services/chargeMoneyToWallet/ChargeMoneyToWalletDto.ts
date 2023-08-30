import { Customer } from "../../domain/customer/Customer";

export type ChargeMoneyToWalletDto = {
    customer: Customer;
    amountToCharge: number;
    paymentMethodId?: string;
}