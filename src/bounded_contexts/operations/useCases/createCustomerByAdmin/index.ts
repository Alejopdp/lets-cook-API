import { stripeService } from "../../application/paymentService";
import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
// import { CustomerSignUpPresenter } from "./customerSignUpPresenter";
import { CreateCustomerByAdmin } from "./createCustomerByAdmin";
import { CreateCustomerByAdminController } from "./createCustomerByAdminController";

// export const createPlan: CreatePlan = new CreatePlan(mockPlanRepository, s3Service);
export const createCustomerByAdmin: CreateCustomerByAdmin = new CreateCustomerByAdmin(mongooseCustomerRepository, s3Service);
// export const customerSignUpPresenter = new CustomerSignUpPresenter();
export const createCustomerByAdminController: CreateCustomerByAdminController = new CreateCustomerByAdminController(createCustomerByAdmin);
