import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { recipeVariantCreator } from "../../services/recipeVariantCreator";
import { UpdateCustomer } from "./updateCustomer";
import { UpdateCustomerController } from "./updateCustomerController";

export const updateCustomer: UpdateCustomer = new UpdateCustomer(mongooseCustomerRepository, s3Service);
export const updateCustomerController = new UpdateCustomerController(updateCustomer);
