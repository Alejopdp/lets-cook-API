import { Customer } from "../../domain/customer/Customer";

export class CustomerSignUpPresenter {
    constructor() {}

    public present({ customer, token }: { customer: Customer; token: string }): {
        userInfo: { id: string | number; email: string };
        token: string;
    } {
        return {
            userInfo: { id: customer.id.value, email: customer.email },
            token,
        };
    }
}
