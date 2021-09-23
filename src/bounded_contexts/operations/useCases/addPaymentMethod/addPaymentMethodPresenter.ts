import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";

export class AddPaymentMethodPresenter {
    public present(paymentMethod: PaymentMethod): any {
        return {
            id: paymentMethod.id.value,
            card: paymentMethod.getCardLabel(),
            expirationDate: paymentMethod.getExpirationDate(),
            isDefault: paymentMethod.isDefault,

        }
    }
}