export interface UpdatePaymentMethodDto {
    customerId: string;
    brand: string;
    last4Numbers: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
    stripeId: string;
    isDefault: boolean;
    paymentId: string;
}
