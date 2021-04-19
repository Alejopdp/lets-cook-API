import { mockRoleRepository } from "../../infra/repositories/role";
import { CreateRole } from "./createRole";
import { CreateRoleController } from "./createRoleController";

export const createRole: CreateRole = new CreateRole(mockRoleRepository);
export const createRoleController: CreateRoleController = new CreateRoleController(createRole);
