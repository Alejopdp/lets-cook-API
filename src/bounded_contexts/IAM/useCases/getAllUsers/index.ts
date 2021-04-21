import { mockUserRepository } from "../../infra/repositories/user";
import { GetAllUsers } from "./getAllUsers";
import { GetAllUsersController } from "./getAllUsersController";

export const getAllUsers: GetAllUsers = new GetAllUsers(mockUserRepository);
export const getAllUsersController: GetAllUsersController = new GetAllUsersController(getAllUsers);
