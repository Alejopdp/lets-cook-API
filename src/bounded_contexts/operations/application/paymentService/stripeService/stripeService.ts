import { IPaymentService } from "../IPaymentService";
import { Stripe } from "stripe";
import { PaymentMethod } from "../../../domain/customer/paymentMethod/PaymentMethod";

export class StripeService implements IPaymentService {
    private _stripe: Stripe;

    constructor(stripe: Stripe) {
        this._stripe = stripe;
    }

    public async paymentIntent(
        amount: number,
        paymentMethod: string,
        receiptEmail: string,
        customerId: string
    ): Promise<Stripe.PaymentIntent> {
        const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
            amount: Math.max(Math.trunc(amount * 100), 50),
            currency: "eur",
            payment_method_types: ["card"],
            receipt_email: receiptEmail,
            payment_method: paymentMethod,
            customer: customerId,
            confirm: true,
            // setup_future_usage: "off_session"
        };

        return await this.stripe.paymentIntents.create(paymentIntentParams);
    }

    public async createCustomer(email: string): Promise<any> {
        const customerCreateParams: Stripe.CustomerCreateParams = {
            email,
        };
        const createdCustomer = await this.stripe.customers.create(customerCreateParams);

        return createdCustomer.id;
    }

    public async addPaymentMethodToCustomer(paymentMethodId: string, customerId: string): Promise<PaymentMethod> {
        const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

        return new PaymentMethod(
            paymentMethod.card?.brand!,
            paymentMethod.card?.last4!,
            paymentMethod.card?.exp_month!,
            paymentMethod.card?.exp_year!,
            paymentMethod.card?.checks?.cvc_check!,
            false,
            paymentMethod.id
        );
    }

    public async removePaymentMethodFromCustomer(paymentMethodId: string): Promise<any> {
        await this.stripe.paymentMethods.detach(paymentMethodId);
    }
    public async addPaymentMethodToCustomerAndSetAsDefault(paymentMethodId: string, customerId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async refund(paymentIntentId: string, amount: number): Promise<void> {
        const refund = await this.stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: Math.trunc(amount * 100),
        });
    }

    /**
     * Getter stripe
     * @return {Stripe}
     */
    public get stripe(): Stripe {
        return this._stripe;
    }
}
