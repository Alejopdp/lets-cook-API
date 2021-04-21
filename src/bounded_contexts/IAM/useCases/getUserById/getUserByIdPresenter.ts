import { User } from "../../domain/user/User";

export class GetUserByIdPresenter {
    public static present(user: User): any {
        return {
            id: user.id.value,
            firstName: user.name.firstName,
            lastName: user.name.lastName,
            fullName: user.name.getFullName(),
            role: user.role.title,
            email: user.email,
        };
    }
}
