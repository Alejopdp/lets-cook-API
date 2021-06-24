import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository, } from "../../infra/repositories/customer";
import { UpdatePassword } from "./updatePassword";
import { UpdatePasswordController } from "./updatePasswordController";

// export const createPlan: CreatePlan = new CreatePlan(mockPlanRepository, s3Service);
export const updatePassword: UpdatePassword = new UpdatePassword(mongooseCustomerRepository, s3Service);
export const updatePasswordController: UpdatePasswordController = new UpdatePasswordController(updatePassword);
