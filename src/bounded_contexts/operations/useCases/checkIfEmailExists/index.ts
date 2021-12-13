import { CheckIfEmailExists } from "./checkIfEmailExists";
import { CheckIfEmailExistsController } from "./checkIfEmailExistsController";
import { mongooseCustomerRepository } from "../../infra/repositories/customer/";

export const checkIfEmailExists: CheckIfEmailExists = new CheckIfEmailExists(mongooseCustomerRepository);
export const checkIfEmailExistsController: CheckIfEmailExistsController = new CheckIfEmailExistsController(checkIfEmailExists);
