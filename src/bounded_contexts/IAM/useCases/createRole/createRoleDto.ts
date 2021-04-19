import { Permission } from "../../domain/permission/Permission";

export interface CreateRoleDto {
    title: string;
    permissions: Permission[];
}
