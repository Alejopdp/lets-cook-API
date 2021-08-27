import { stripeService } from "../../application/paymentService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { AddPaymentMethod } from "./addPaymentMethod";
import { AddPaymentMethodController } from "./addPaymentMethodController";
import { AddPaymentMethodPresenter } from "./addPaymentMethodPresenter";

export const addPaymentMethod: AddPaymentMethod = new AddPaymentMethod(mongooseCustomerRepository, stripeService);
export const addPaymentMethodPresenter: AddPaymentMethodPresenter = new AddPaymentMethodPresenter();
export const addPaymentMethodController: AddPaymentMethodController = new AddPaymentMethodController(
    addPaymentMethod,
    addPaymentMethodPresenter
);
