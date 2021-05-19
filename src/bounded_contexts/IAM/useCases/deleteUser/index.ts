import { mockUserRepository, mongooseUserRepository } from "../../infra/repositories/user";
import { DeleteUser } from "./deleteUser";
import { DeleteUserController } from "./deleteUserController";

export const deleteUser: DeleteUser = new DeleteUser(mongooseUserRepository);
export const deleteUserController: DeleteUserController = new DeleteUserController(deleteUser);
