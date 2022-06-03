import { Mapper } from "../../../core/infra/Mapper";
import { Permission } from "../domain/permission/Permission";
import { Role } from "../domain/role/Role";

export class RoleMapper implements Mapper<Role, any> {
    public toDomain(raw: any): Role {
        const permissions: Permission[] = raw.permissions.map((permission: string) => (<any>Permission)[permission]);

        return new Role(raw.title, permissions, raw._id);
    }
    public toPersistence(t: Role) {
        return {
            title: t.title,
            permissions: t.permissions,
            _id: t.id,
        };
    }
}
