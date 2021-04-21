import { User } from "../../domain/user/User";
import { GetUserByIdPresenter } from "../getUserById/getUserByIdPresenter";

export class GetAllUsersPresenter {
    public static present(users: User[]): any {
        const presentedUsers = [];

        for (let user of users) {
            presentedUsers.push(GetUserByIdPresenter.present(user));
        }

        return presentedUsers;
    }
}
