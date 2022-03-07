import { jwtTokenService } from "../../../IAM/application/tokenService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { UpdateCustomerEmail } from "./updateCustomerEmail";
import { UpdateCustomerEmailController } from "./updateCustomerEmailController";

export const updateCustomer: UpdateCustomerEmail = new UpdateCustomerEmail(mongooseCustomerRepository, jwtTokenService);
export const updateCustomerEmailController = new UpdateCustomerEmailController(updateCustomer);
