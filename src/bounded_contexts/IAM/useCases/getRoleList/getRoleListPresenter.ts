import { Role } from "../../domain/role/Role";

export class GetRoleListPresenter {
    public static present(roles: Role[]): any {
        const presentedRoles = [];

        for (let role of roles) {
            presentedRoles.push({
                title: role.title,
                permissions: role.permissions,
            });
        }

        return presentedRoles;
    }
}
