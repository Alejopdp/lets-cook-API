import { Customer } from "@src/bounded_contexts/operations/domain/customer/Customer";
import { Order } from "@src/bounded_contexts/operations/domain/order/Order";
import { Subscription } from "@src/bounded_contexts/operations/domain/subscription/Subscription";
import { RecipeSelection } from "../../bounded_contexts/operations/domain/order/RecipeSelection";

export interface NewSubscriptionNotificationDto {
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    recipeSelection: RecipeSelection[];
    planName: string;
    firstOrderId: string;
    hasIndicatedRestrictions: string;
    shippingCost: number;
    shippingDay: string;
    isPlanAhorro: boolean;
    planSku: string;
}

export interface PaymentOrderBilledNotificationDto {
    shippingCost: number;
    foodVAT: number;
    totalAmount: number;
    shippingDate: string;
    shippingCustomerName: string;
    shippingAddressName: string;
    shippingAddressCity: string;
    phoneNumber: string;
    customerEmail: string;
    orders: Order[];
    paymentOrderHumanNumber: string;
}
export interface INotificationService {
    notifyNewBackOfficeUserToGeneratePassword(email: string, redirectUrl: string): Promise<void>;
    notifyUserToGeneratePassword(email: string, redirectUrl: string): Promise<void>;
    notifyNewBackOfficeUserToRecoverPassword(email: string, redirectUrl: string): Promise<void>;
    notifyCustomerAboutSuccesfulPurchase(): Promise<void>;
    notifyCustomerAboutNewSubscriptionSuccessfullyCreated(dto: NewSubscriptionNotificationDto): Promise<void>;
    notifyAdminsAboutNewSubscriptionSuccessfullyCreated(dto: NewSubscriptionNotificationDto): Promise<void>;
    notifyAdminsAboutNewSubscriptionsSuccessfullyCreated(customerEmail: string, customerName: string, planNames: string[]): Promise<void>;
    notifyAdminAbountNewSale(): Promise<void>;
    notifyAdminAboutACancellation(subscription: Subscription, adminNameOrEmail?: string): Promise<void>;
    notifyAdminAboutAddressChange(customer: Customer, adminNameOrEmail?: string): Promise<void>;
    notifyAdminAboutRestrictionChange(subscription: Subscription): Promise<void>;
    notifyAdminAboutAPlanReactivation(subscription: Subscription): Promise<void>;
    sendErrorEmail(errorMessage: string, endpoint: string, userEmail: string | undefined): Promise<void>;
    notifyCustomerAboutPaymentOrderBilled(dto: PaymentOrderBilledNotificationDto): Promise<void>;
}
