import { Customer } from "../../domain/customer/Customer";
import { Locale } from "../../domain/locale/Locale";

export class GetCustomerByIdPresenter {
    public present(customer: Customer, locale: Locale): any {
        return {
            id: customer.id.value.toString(),
            email: customer.email,
            personalData: customer.getPersonalInfo(),
            firstName: customer.getPersonalInfo().name,
            lastName: customer.getPersonalInfo().lastName,
            phone1: customer.getPersonalInfo().phone1,
            phone2: customer.getPersonalInfo().phone2,
            preferredLanguage: customer.getPersonalInfo().preferredLanguage,
            shippingAddress: customer.getShippingAddress(),
            billingData: customer.getBillingData(),
            paymentMethods: customer.paymentMethods.map((method) => ({
                id: method.id.value,
                card: method.getCardLabel(locale),
                expirationDate: method.getExpirationDate(locale),
                isDefault: method.isDefault,
            })),
            wallet: customer.wallet ? {
                balance: customer.wallet.balance,
                amountToCharge: customer.wallet.amountToCharge,
                paymentMethodForCharging: customer.wallet.paymentMethodForCharging,
                last4Numbers: customer.paymentMethods.find(pm => pm.id.toString() === customer.wallet?.paymentMethodForCharging)?.last4Numbers ?? "",
                isEnabled: customer.wallet.isEnabled,
                datesOfCharge: customer.wallet.datesOfCharge.map(dateOfCharge => ({ dayNumber: dateOfCharge.day.dayNumberOfWeek, hour: dateOfCharge.hour, minute: dateOfCharge.minute })),
                walletMovementsLogs: customer.getPresentedWalletMovements(locale),

            } : undefined,

        };
    }
}
