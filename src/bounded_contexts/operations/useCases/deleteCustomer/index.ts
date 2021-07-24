import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { DeleteCustomer } from "./deleteCustomer";
import { DeleteCustomerController } from "./deleteCustomerController";

// export const deletePlan: DeletePlan = new DeletePlan(mockPlanRepository);
export const deleteCustomer: DeleteCustomer = new DeleteCustomer(mongooseCustomerRepository, mongooseSubscriptionRepository);
export const deleteCustomerController: DeleteCustomerController = new DeleteCustomerController(deleteCustomer);
