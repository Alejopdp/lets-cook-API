import { Customer } from "../../domain/customer/Customer";
// import { GetUserByIdPresenter } from "../getUserById/getUserByIdPresenter";

export class GetAllUsersPresenter {
    public static present(users: Customer[]): any {
        const presentedUsers = [];

        for (let user of users) {
            presentedUsers.push(user);
        }

        return presentedUsers;
    }
}
