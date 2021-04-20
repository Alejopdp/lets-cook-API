import { INotificationService } from "./INotificationService";
import Mail from "nodemailer/lib/mailer";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class NodemailerService implements INotificationService {
    private _transporter: Mail;

    constructor(transporter: Mail) {
        this._transporter = transporter;
    }

    public static create(user: string | undefined, password: string | undefined) {
        const options: SMTPTransport.Options = {
            service: "gmail",
            auth: {
                user,
                pass: password,
            },
        };

        const transporter: Mail = nodemailer.createTransport(options);

        return new NodemailerService(transporter);
    }

    private getMailOptions(to: string | Mail.Address | (string | Mail.Address)[] | undefined, subject?: string, html?: string): any {
        const mailOptions: MailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        };

        return mailOptions;
    }

    public async notifyNewBackOfficeUser(email: string, redirectUrl: string): Promise<void> {
        // TO DO: Pass redirectUrl for generating password
        await this.nodemailer.sendMail(this.getMailOptions(email, "Tu usuario fue creado"));
    }

    /**
     * Getter nodemailer
     * @return {Mail}
     */
    public get nodemailer(): Mail {
        return this._transporter;
    }
}
