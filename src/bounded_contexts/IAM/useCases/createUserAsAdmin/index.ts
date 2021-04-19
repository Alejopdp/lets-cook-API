import { mockRoleRepository } from "../../infra/repositories/role";
import { mockUserRepository } from "../../infra/repositories/user";
import { CreateUserAsAdmin } from "./createUserAsAdmin";
import { CreateUserAsAdminController } from "./createUserAsAdminController";

export const createUserAsAdmin: CreateUserAsAdmin = new CreateUserAsAdmin(mockUserRepository, mockRoleRepository);
export const createUserAsAdminController: CreateUserAsAdminController = new CreateUserAsAdminController(createUserAsAdmin);
