import { IPaymentService } from "../IPaymentService";
import { Stripe } from "stripe";

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
            amount,
            currency: "eur",
            payment_method_types: ["card"],
            receipt_email: receiptEmail,
            payment_method: paymentMethod,
            customer: customerId,
            confirm: true,
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

    /**
     * Getter stripe
     * @return {Stripe}
     */
    public get stripe(): Stripe {
        return this._stripe;
    }
}
