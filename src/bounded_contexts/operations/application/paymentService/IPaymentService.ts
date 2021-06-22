import { Stripe } from "stripe";

export interface IPaymentService {
    paymentIntent(amount: number, paymentMethod: string, receiptEmail: string, customerId: string): Promise<Stripe.PaymentIntent>;
    createCustomer(email: string): Promise<any>;
}
