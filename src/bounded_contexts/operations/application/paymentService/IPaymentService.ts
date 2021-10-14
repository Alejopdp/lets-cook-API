import { Stripe } from "stripe";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";

export interface IPaymentService {
    paymentIntent(amount: number, paymentMethod: string, receiptEmail: string, customerId: string): Promise<Stripe.PaymentIntent>;
    createCustomer(email: string): Promise<any>;
    addPaymentMethodToCustomer(paymentMetodId: string, customerId: string): Promise<PaymentMethod>;
    addPaymentMethodToCustomerAndSetAsDefault(paymentMethodId: string, customerId: string): Promise<void>;
    removePaymentMethodFromCustomer(paymentMethodId: string): Promise<any>
    refund(paymentIntentId: string, amount: number): Promise<void>;
}
