import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseLogRepository } from "../../infra/repositories/log";
import { UpdatePasswordWithoutCode } from "./updatePasswordWithoutCode";
import { UpdatePasswordWithoutCodeController } from "./updatePasswordWithoutCodeController";

export const updatePasswordWithoutCode: UpdatePasswordWithoutCode = new UpdatePasswordWithoutCode(
    mongooseCustomerRepository,
    mongooseLogRepository
);
export const updatePasswordWithoutCodeController: UpdatePasswordWithoutCodeController = new UpdatePasswordWithoutCodeController(
    updatePasswordWithoutCode
);
