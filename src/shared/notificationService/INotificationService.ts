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
}

export interface INotificationService {
    notifyNewBackOfficeUserToGeneratePassword(email: string, redirectUrl: string): Promise<void>;
    notifyUserToGeneratePassword(email: string, redirectUrl: string): Promise<void>;
    notifyNewBackOfficeUserToRecoverPassword(email: string, redirectUrl: string): Promise<void>;
    notifyCustomerAboutNewSubscriptionSuccessfullyCreated(dto: NewSubscriptionNotificationDto): Promise<void>;
    notifyAdminsAboutNewSubscriptionSuccessfullyCreated(): Promise<void>;
    sendErrorEmail(errorMessage: string): Promise<void>;
}
