export interface INotificationService {
    notifyNewBackOfficeUser(email: string, redirectUrl: string): Promise<void>;
}
