import { Permission } from "../src/bounded_contexts/IAM/domain/permission/Permission";
import { Role } from "../src/bounded_contexts/IAM/domain/role/Role";

export const adminRole: Role = new Role("Administrador", [
    Permission.CREATE_ADMIN_USER,
    Permission.CREATE_PLAN,
    Permission.CREATE_RECIPE,
    Permission.DELETE_PLAN,
    Permission.DELETE_RECIPE,
    Permission.UPDATE_PLAN,
    Permission.UPDATE_RECIPE,
    Permission.VIEW_PLANS,
    Permission.VIEW_RECIPES,
]);
