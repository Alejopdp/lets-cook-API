import { INotificationService, NewSubscriptionNotificationDto, PaymentOrderBilledNotificationDto } from "./INotificationService";
import Mail from "nodemailer/lib/mailer";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Customer } from "@src/bounded_contexts/operations/domain/customer/Customer";
import { Subscription } from "@src/bounded_contexts/operations/domain/subscription/Subscription";

export class NodemailerService implements INotificationService {
    private _transporter: Mail;

    constructor(transporter: Mail) {
        this._transporter = transporter;
    }
    notifyCustomerAboutPaymentOrderBilled(dto: PaymentOrderBilledNotificationDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyCustomerAboutSuccesfulPurchase(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminAbountNewSale(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminAboutACancellation(subscription: Subscription, adminNameOrEmail?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminAboutAddressChange(customer: Customer, adminNameOrEmail?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminAboutRestrictionChange(subscription: Subscription): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminAboutAPlanReactivation(subscription: Subscription): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyCustomerAboutNewSubscriptionSuccessfullyCreated(dto: NewSubscriptionNotificationDto): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyAdminsAboutNewSubscriptionSuccessfullyCreated(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    sendErrorEmail(errorMessage: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    notifyNewBackOfficeUserToRecoverPassword(email: string, redirectUrl: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    notifyUserToGeneratePassword(email: string, redirectUrl: string): Promise<void> {
        throw new Error("Method not implemented.");
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

    public async notifyNewBackOfficeUserToGeneratePassword(email: string, redirectUrl: string): Promise<void> {
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
