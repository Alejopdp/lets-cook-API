import { s3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { GetCustomerById } from "./getCustomerById";
import { GetCustomerByIdController } from "./getCustomerByIdController";
import { GetCustomerByIdPresenter } from "./getCustomerByIdPresenter";

export const getCustomerById: GetCustomerById = new GetCustomerById(mongooseCustomerRepository, s3Service);
export const getCustomerByIdPresenter: GetCustomerByIdPresenter = new GetCustomerByIdPresenter();
export const getCustomerByIdController: GetCustomerByIdController = new GetCustomerByIdController(
    getCustomerById,
    getCustomerByIdPresenter
);
