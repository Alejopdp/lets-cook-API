import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { Locale } from "../../domain/locale/Locale";

export class AddPaymentMethodPresenter {
    public present(paymentMethod: PaymentMethod, locale: Locale): any {
        return {
            id: paymentMethod.id.value,
            card: paymentMethod.getCardLabel(locale),
            expirationDate: paymentMethod.getExpirationDate(locale),
            isDefault: paymentMethod.isDefault,
        };
    }
}
