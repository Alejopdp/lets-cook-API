export interface INotificationService {
    notifyNewBackOfficeUserToGeneratePassword(email: string, redirectUrl: string): Promise<void>;
    notifyUserToGeneratePassword(email: string, redirectUrl: string): Promise<void>;
    notifyNewBackOfficeUserToRecoverPassword(email: string, redirectUrl: string): Promise<void>;
    notifyCustomerAboutNewSubscriptionSuccessfullyCreated(): Promise<void>;
    notifyAdminsAboutNewSubscriptionSuccessfullyCreated(): Promise<void>;
    sendErrorEmail(errorMessage: string): Promise<void>;
}
