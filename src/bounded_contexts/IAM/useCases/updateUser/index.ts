import { mockRoleRepository, mongooseRoleRepository } from "../../infra/repositories/role";
import { mockUserRepository, mongooseUserRepository } from "../../infra/repositories/user";
import { UpdateUser } from "./updateUser";
import { UpdateUserController } from "./updateUserController";

// export const updateUser: UpdateUser = new UpdateUser(mockUserRepository, mockRoleRepository);
export const updateUser: UpdateUser = new UpdateUser(mongooseUserRepository, mongooseRoleRepository);
export const updateUserController: UpdateUserController = new UpdateUserController(updateUser);
