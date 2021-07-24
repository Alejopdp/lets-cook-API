import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { recipeVariantCreator } from "../../services/recipeVariantCreator";
import { UpdateCustomerEmail } from "./updateCustomerEmail";
import { UpdateCustomerEmailController } from "./updateCustomerEmailController";

export const updateCustomer: UpdateCustomerEmail = new UpdateCustomerEmail(mongooseCustomerRepository, s3Service);
export const updateCustomerEmailController = new UpdateCustomerEmailController(updateCustomer);
