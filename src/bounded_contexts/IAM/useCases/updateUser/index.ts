import { mockRoleRepository } from "../../infra/repositories/role";
import { mockUserRepository } from "../../infra/repositories/user";
import { UpdateUser } from "./updateUser";
import { UpdateUserController } from "./updateUserController";

export const updateUser: UpdateUser = new UpdateUser(mockUserRepository, mockRoleRepository);
export const updateUserController: UpdateUserController = new UpdateUserController(updateUser);
