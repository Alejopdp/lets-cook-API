import { Stripe } from "stripe";
import { IPaymentService } from "./IPaymentService";
import { StripeService } from "./stripeService/stripeService";

const stripeConfig: Stripe.StripeConfig = {
    apiVersion: "2020-08-27",
};
const stripe = new Stripe(process.env.PRIVATE_STRIPE_API_KEY as string, stripeConfig);

export const stripeService: IPaymentService = new StripeService(stripe);
