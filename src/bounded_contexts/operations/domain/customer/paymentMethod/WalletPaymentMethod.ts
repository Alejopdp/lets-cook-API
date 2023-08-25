import { PaymentMethod } from "./PaymentMethod";
import { PaymentMethodId } from "./PaymentMethodId";

export class WalletPaymentMehtod extends PaymentMethod {

    constructor(isDefault: boolean) {
        super("", "", 0, 0, "", isDefault, "stripeId", new PaymentMethodId("wallet"));
    }

}