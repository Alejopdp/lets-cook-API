import { Stripe } from "stripe";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { PaymentIntent } from ".";

export type StripePaymentIntentStatus =
    | "requires_payment_method"
    | "requires_confirmation"
    | "requires_action"
    | "processing"
    | "requires_capture"
    | "canceled"
    | "succeeded";
export interface IPaymentService {
    paymentIntent(
        amount: number,
        paymentMethod: string,
        receiptEmail: string,
        customerId: string,
        offSession: boolean
    ): Promise<Stripe.PaymentIntent>;
    createPaymentIntentAndSetupForFutureUsage(
        amount: number,
        paymentMethod: string,
        receiptEmail: string,
        customerId: string
    ): Promise<PaymentIntent>;
    createCustomer(email: string): Promise<any>;
    getPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod>;
    addPaymentMethodToCustomer(paymentMetodId: string, customerId: string): Promise<PaymentMethod>;
    addPaymentMethodToCustomerAndSetAsDefault(paymentMethodId: string, customerId: string): Promise<void>;
    removePaymentMethodFromCustomer(paymentMethodId: string): Promise<any>;
    refund(paymentIntentId: string, amount: number): Promise<void>;
    setupIntent(customerId: string, usage: "off_session" | "on_session"): Promise<Stripe.SetupIntent>;
}
