import { roleMapper } from ".";
import { logger } from "../../../../config";
import { Mapper } from "../../../core/infra/Mapper";
import { Role } from "../domain/role/Role";
import { User } from "../domain/user/User";
import { UserId } from "../domain/user/UserId";
import { UserName } from "../domain/user/UserName";
import { UserPassword } from "../domain/user/UserPassword";

export class UserMapper extends Mapper<User> {
    public toDomain(raw: any): User {
        const role: Role = roleMapper.toDomain(raw.roleId);
        const name: UserName = new UserName(raw.firstName, raw.lastName);
        const pasword: UserPassword = UserPassword.create(raw.password, true);
        const userId: UserId = new UserId(raw.id);

        return User.create(name, raw.email, raw.isEmailVerified, role, raw.isActivated, pasword, undefined, undefined, undefined, userId);
    }
    public toPersistence(t: User) {
        return {
            firstName: t.name.firstName,
            lastName: t.name.lastName,
            email: t.email,
            isActivated: t.isActivated,
            password: t.password ? t.password.value : "",
            roleId: t.role.id,
            isEmailVerified: t.isEmailVerified,
        };
    }
}
