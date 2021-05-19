import { SES } from "aws-sdk";
import { SendEmailRequest } from "aws-sdk/clients/ses";
import { INotificationService } from "./INotificationService";

export class AwsSesService implements INotificationService {
    private _ses: SES;

    constructor(ses: SES) {
        this._ses = ses;
    }

    private async sendMail(toAddresses: string[], subject: string, textBody: string, htmlBody: string): Promise<void> {
        const mailParams: SendEmailRequest = {
            Destination: {
                ToAddresses: toAddresses,
            },
            Source: process.env.NOTIFICATION_EMAIL_USER!,
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Text: { Data: textBody },
                    Html: { Data: htmlBody },
                },
            },
        };

        await this.ses.sendEmail(mailParams).promise();
    }

    public async notifyNewBackOfficeUserToGeneratePassword(email: string, redirectUrl: string): Promise<void> {
        await this.sendMail([email], "Tu usuario fue creado", redirectUrl, redirectUrl);
    }

    public async notifyUserToGeneratePassword(email: string, redirectUrl: string): Promise<void> {
        await this.sendMail([email], "Tu usuario fue creado", redirectUrl, redirectUrl);
    }

    /**
     * Getter ses
     * @return {SES}
     */
    public get ses(): SES {
        return this._ses;
    }
}
