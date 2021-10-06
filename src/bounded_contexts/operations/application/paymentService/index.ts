import { Stripe } from "stripe";
import { IPaymentService } from "./IPaymentService";
import { StripeService } from "./stripeService/stripeService";

const stripeConfig: Stripe.StripeConfig = {
    apiVersion: "2020-08-27",
};
const stripe = new Stripe("sk_test_9ixChBmgrwQyQn814Tb8gRbm00nQx5UuDU", stripeConfig);

export const stripeService: IPaymentService = new StripeService(stripe);
