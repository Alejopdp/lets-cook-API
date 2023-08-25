import { Stripe } from "stripe";
import { IPaymentService } from "./IPaymentService";
import { StripeService } from "./stripeService/stripeService";

const stripeConfig: Stripe.StripeConfig = {
    apiVersion: "2022-11-15",
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, stripeConfig);

export type PaymentIntent = { id: string; status: string; client_secret: string | null, amount: number }

export const stripeService: IPaymentService = new StripeService(stripe);
