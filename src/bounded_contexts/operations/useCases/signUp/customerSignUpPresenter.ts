import { Customer } from "../../domain/customer/Customer";
import { Locale } from "../../domain/locale/Locale";

export class CustomerSignUpPresenter {
    constructor() {}

    public present({ customer, token }: { customer: Customer; token: string }): {
        userInfo: { id: string | number; email: string; preferredLanguage: Locale | string };
        token: string;
    } {
        return {
            userInfo: {
                id: customer.id.value,
                email: customer.email,
                preferredLanguage: customer.getPersonalInfo().preferredLanguage || Locale.es,
            },
            token,
        };
    }
}
