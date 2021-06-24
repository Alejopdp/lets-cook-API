import { awsSesService } from "../../../../shared/notificationService";
import { stripeService } from "../../application/paymentService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { CreateSubscription } from "./createSubscription";
import { CreateSubscriptionController } from "./createSubscriptionController";

export const createSubscription: CreateSubscription = new CreateSubscription(
    mongooseCustomerRepository,
    mongoosePlanRepository,
    stripeService,
    awsSesService
);
export const createSubscriptionController: CreateSubscriptionController = new CreateSubscriptionController(createSubscription);
