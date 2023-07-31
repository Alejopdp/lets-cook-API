import { v3S3Service } from "../../application/storageService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseLogRepository } from "../../infra/repositories/log";
import { UpdatePassword } from "./updatePassword";
import { UpdatePasswordController } from "./updatePasswordController";

export const updatePassword: UpdatePassword = new UpdatePassword(mongooseCustomerRepository, v3S3Service, mongooseLogRepository);
export const updatePasswordController: UpdatePasswordController = new UpdatePasswordController(updatePassword);
