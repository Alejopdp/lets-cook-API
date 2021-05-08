import { Permission } from "../../../domain/permission/Permission";
import { Role } from "../../../domain/role/Role";
import { IRoleRepository } from "./IRoleRepository";
import { MockRoleRepository } from "./mockRoleRepository";
import { MongooseRoleRepository } from "./mongooseRoleRepository";

const roleDatabase: Role[] = [new Role("Admin", [Permission.CREATE_ADMIN_USER])];

export const mockRoleRepository: IRoleRepository = new MockRoleRepository(roleDatabase);
export const mongooseRoleRepository: MongooseRoleRepository = new MongooseRoleRepository();
