export interface IEmailService {
    notifyNewBackOfficeUser(email: string, redirectUrl: string): Promise<void>;
}
