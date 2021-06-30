import { Customer } from "../../domain/customer/Customer";

export class LoginWithEmailPresenter {
    public static present(token: string, customer: Customer): any {
        return {
            userInfo: {
                email: customer.email,
                id: customer.id.value
            },
            token
        };
    }
}
