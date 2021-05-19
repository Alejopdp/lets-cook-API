export interface INotificationService {
    notifyNewBackOfficeUserToGeneratePassword(email: string, redirectUrl: string): Promise<void>;
    notifyUserToGeneratePassword(email: string, redirectUrl: string): Promise<void>;
    notifyNewBackOfficeUserToRecoverPassword(email: string, redirectUrl: string): Promise<void>;
}
