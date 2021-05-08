import { mockUserRepository, mongooseUserRepository } from "../../infra/repositories/user";
import { GetDataForGeneratingPassword } from "./getDataForGeneratingPassword";
import { GetDataForGeneratingPasswordController } from "./getDataForGeneratingPasswordController";

// export const getDataForGeneratingPassword: GetDataForGeneratingPassword = new GetDataForGeneratingPassword(mockUserRepository);
export const getDataForGeneratingPassword: GetDataForGeneratingPassword = new GetDataForGeneratingPassword(mongooseUserRepository);
export const getDataForGeneratingPasswordController: GetDataForGeneratingPasswordController = new GetDataForGeneratingPasswordController(
    getDataForGeneratingPassword
);
