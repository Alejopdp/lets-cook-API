import Stripe from "stripe";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { IPaymentService } from "./IPaymentService";
import { PaymentIntent } from ".";

export class MockPaymentService implements IPaymentService {

    paymentIntent(amount: number, paymentMethod: string, receiptEmail: string, customerId: string, offSession: boolean): Promise<Stripe.PaymentIntent> {
        throw new Error("Method not implemented.");
    }
    public async createPaymentIntentAndSetupForFutureUsage(amount: number, paymentMethod: string, receiptEmail: string, customerId: string): Promise<PaymentIntent> {
        return {
            client_secret: "client_secret",
            id: "id",
            status: "succeeded"
        }
    }
    createCustomer(email: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
        throw new Error("Method not implemented.");
    }
    public async addPaymentMethodToCustomer(paymentMetodId: string, customerId: string): Promise<PaymentMethod> {
        return new PaymentMethod("visa", "420", 10, 2028, "420", true, paymentMetodId)
    }
    addPaymentMethodToCustomerAndSetAsDefault(paymentMethodId: string, customerId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removePaymentMethodFromCustomer(paymentMethodId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    refund(paymentIntentId: string, amount: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setupIntent(customerId: string, usage: "off_session" | "on_session"): Promise<Stripe.SetupIntent> {
        throw new Error("Method not implemented.");
    }

}