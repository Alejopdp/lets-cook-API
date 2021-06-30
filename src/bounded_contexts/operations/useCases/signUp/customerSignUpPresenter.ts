import { Customer } from "../../domain/customer/Customer";

export class CustomerSignUpPresenter {
    constructor() {}

    public present(customer: Customer): { userInfo: {id: string | number; email: string} } {
        return {
            userInfo: { id: customer.id.value, email: customer.email },
        };
    }
}
