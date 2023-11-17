import { Customer } from "../../domain/customer/Customer";
import { Locale } from "../../domain/locale/Locale";

export class LoginWithEmailPresenter {
    public static present(token: string, customer: Customer, locale: Locale): any {
        return {
            userInfo: {
                email: customer.email,
                id: customer.id.value,
                firstName: customer.personalInfo?.name,
                lastName: customer.personalInfo?.lastName,
                phone1: customer.personalInfo?.phone1,
                phone2: customer.personalInfo?.phone2,
                shippingAddress: {
                    addressDetails: customer.shippingAddress?.details,
                    addressName: customer.shippingAddress?.name,
                    latitude: customer.shippingAddress?.latitude,
                    longitude: customer.shippingAddress?.longitude,
                },
                paymentMethods: customer.paymentMethods.map((method) => ({
                    id: method.id.value,
                    card: method.getCardLabel(locale),
                    isDefault: method.isDefault,
                    expirationDate: method.getExpirationDate(locale),
                })),
                preferredLanguage: customer.getPersonalInfo().preferredLanguage || Locale.es,
                wallet: customer.wallet ? {
                    balance: customer.wallet.balance,
                    amountToCharge: customer.wallet.amountToCharge,
                    paymentMethodForCharging: customer.wallet.paymentMethodForCharging,
                    last4Numbers: customer.paymentMethods.find(pm => pm.id.toString() === customer.wallet?.paymentMethodForCharging)?.last4Numbers ?? "",
                    isEnabled: customer.wallet.isEnabled,
                    datesOfCharge: customer.wallet.datesOfCharge.map(dateOfCharge => ({ dayNumber: dateOfCharge.day.dayNumberOfWeek, hour: dateOfCharge.hour, minute: dateOfCharge.minute })),
                    walletMovementsLogs: customer.getPresentedWalletMovements(locale),

                } : undefined,

            },
            token,
        };
    }
}
