import { Mapper } from "../../../../core/infra/Mapper";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { PaymentMethodId } from "../../domain/customer/paymentMethod/PaymentMethodId";
import { Locale } from "../../domain/locale/Locale";

export class PaymentMethodMapper extends Mapper<PaymentMethod, any> {
    public toDomain(raw: any, locale?: Locale): PaymentMethod {
        return new PaymentMethod(
            raw.brand,
            raw.last4Numbers,
            raw.exp_month,
            raw.exp_year,
            raw.cvc,
            raw.isDefault,
            raw.stripeId,
            new PaymentMethodId(raw._id)
        );
    }

    public toPersistence(t: PaymentMethod, locale?: Locale): any {
        return {
            _id: t.id.value,
            brand: t.brand,
            last4Numbers: t.last4Numbers,
            exp_month: t.exp_month,
            exp_year: t.exp_year,
            cvc: t.cvc,
            isDefault: t.isDefault,
            stripeId: t.stripeId,
        };
    }
}
