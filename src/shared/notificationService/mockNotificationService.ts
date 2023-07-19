import { Customer } from "@src/bounded_contexts/operations/domain/customer/Customer";
import { Locale } from "@src/bounded_contexts/operations/domain/locale/Locale";
import { Subscription } from "@src/bounded_contexts/operations/domain/subscription/Subscription";
import { INotificationService, NewSubscriptionNotificationDto, PaymentOrderBilledNotificationDto } from "./INotificationService";

export class MockNotificationService implements INotificationService {
    notifyNewBackOfficeUserToGeneratePassword(email: string, redirectUrl: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyUserToGeneratePassword(email: string, redirectUrl: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyNewBackOfficeUserToRecoverPassword(email: string, redirectUrl: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyCustomerAboutSuccesfulPurchase(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyCustomerAboutNewSubscriptionSuccessfullyCreated(dto: NewSubscriptionNotificationDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminsAboutNewSubscriptionSuccessfullyCreated(dto: NewSubscriptionNotificationDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminsAboutNewSubscriptionsSuccessfullyCreated(customerEmail: string, customerName: string, planNames: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminAbountNewSale(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminAboutACancellation(subscription: Subscription, adminNameOrEmail?: string | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminAboutAddressChange(customer: Customer, adminNameOrEmail?: string | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminAboutRestrictionChange(subscription: Subscription): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminAboutAPlanReactivation(subscription: Subscription): Promise<void> {
        throw new Error("Method not implemented.");
    }
    sendErrorEmail(errorMessage: string, endpoint: string, userEmail: string | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyCustomerAboutPaymentOrderBilled(dto: PaymentOrderBilledNotificationDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
    sendUpdateEmailEmail(userEmail: string, changeEmailUrl: string, locale: Locale): Promise<void> {
        throw new Error("Method not implemented.");
    }

}