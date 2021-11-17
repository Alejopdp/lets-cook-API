import { FuturePaymentSetup } from "./futurePaymentSetup";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { stripeService } from "../paymentService";
import { FuturePaymentSetupController } from "./futurePaymentSetupController";

export const futurePaymentSetup: FuturePaymentSetup = new FuturePaymentSetup(mongooseCustomerRepository, stripeService);
export const futurePaymentSetupController: FuturePaymentSetupController = new FuturePaymentSetupController(futurePaymentSetup);
