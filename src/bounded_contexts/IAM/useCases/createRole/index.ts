import { mockRoleRepository, mongooseRoleRepository } from "../../infra/repositories/role";
import { CreateRole } from "./createRole";
import { CreateRoleController } from "./createRoleController";

// export const createRole: CreateRole = new CreateRole(mockRoleRepository);
export const createRole: CreateRole = new CreateRole(mongooseRoleRepository);
export const createRoleController: CreateRoleController = new CreateRoleController(createRole);
