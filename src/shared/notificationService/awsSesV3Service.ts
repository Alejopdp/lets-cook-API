import { SESClient, SendEmailRequest, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { Subscription } from "../../bounded_contexts/operations/domain/subscription/Subscription";
import { Customer } from "../../bounded_contexts/operations/domain/customer/Customer";
import { RecipeSelection } from "../../bounded_contexts/operations/domain/order/RecipeSelection";
import {
    welcomeTemplate,
    addressChangeTemplate,
    newCancellationTemplate,
    planReactivationTemplate,
    restrictionChangeTemplate,
    newSubscriptionTemplate,
    sendRecoverPasswordCodeTemplate,
    ticketTemplate,
    newSubscriptionsTemplate,
    updateEmailTemplate,
} from "../../emailTemplates/emailTemplates";
import { planAhorroMailTemplate } from "../../emailTemplates/planAhorro";
import { vegPlans } from "../../emailTemplates/vegPlans";
import { otherPlans } from "../../emailTemplates/otherPlans";
import { INotificationService, NewSubscriptionNotificationDto, PaymentOrderBilledNotificationDto } from "./INotificationService";
import { Locale } from "../../bounded_contexts/operations/domain/locale/Locale";
export class AwsV3SesService implements INotificationService {
    private _ses: SESClient;

    constructor() {
        this._ses = new SESClient({ region: "eu-west-3", credentials: { accessKeyId: process.env.SES_ACCES_KEY_ID!, secretAccessKey: process.env.SES_SECRET_ACCES_ID! } });
    }
    public async notifyCustomerAboutSuccesfulPurchase(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private async sendPlanAhorroMail(customerEmail: string, customerName: string): Promise<void> {
        await this.sendMail([customerEmail], `Hola ${customerName}, ¡Gracias por tu compra!`, "", planAhorroMailTemplate(customerName));
    }

    private async sendVegPlanMail(
        customerEmail: string,
        customerName: string,
        planName: string,
        recipeSelection: RecipeSelection[],
        hasIndicatedRestrictions: boolean
    ): Promise<void> {
        await this.sendMail(
            [customerEmail],
            `Hola ${customerName}, ¡Gracias por tu compra!`,
            "",
            vegPlans(customerName, planName, recipeSelection, hasIndicatedRestrictions)
        );
    }

    private async sendOtherPlanMail(
        customerEmail: string,
        customerName: string,
        planName: string,
        recipeSelection: RecipeSelection[],
        hasIndicatedRestrictions: boolean
    ): Promise<void> {
        await this.sendMail(
            [customerEmail],
            `Hola ${customerName}, ¡Gracias por tu compra!`,
            "",
            otherPlans(customerName, planName, recipeSelection, hasIndicatedRestrictions)
        );
    }

    public async notifyAdminAboutAPlanReactivation(subscription: Subscription): Promise<void> {
        await this.sendMailToAdmins("Reactivación de plan", "", planReactivationTemplate(subscription, Locale.es));
    }
    public async notifyAdminAbountNewSale(): Promise<void> { }

    public async notifyAdminAboutACancellation(subscription: Subscription, adminNameOrEmail?: string): Promise<void> {
        await this.sendMailToAdmins("Nueva cancelación de plan", "", newCancellationTemplate(subscription, Locale.es, adminNameOrEmail));
    }
    public async notifyAdminAboutAddressChange(customer: Customer, adminNameOrEmail?: string): Promise<void> {
        await this.sendMailToAdmins("Cambio de dirección", "", addressChangeTemplate(customer, adminNameOrEmail));
    }
    public async notifyAdminAboutRestrictionChange(subscription: Subscription, adminNameOrEmail?: string): Promise<void> {
        await this.sendMailToAdmins("Cambio de restricción", "", restrictionChangeTemplate(subscription, adminNameOrEmail));
    }

    public async sendErrorEmail(errorMessage: string, endpoint: string, userEmail: string = ""): Promise<void> {
        this.sendMail(
            ["alejo@novolabs.xyz"],
            "Lets cook - Error",
            errorMessage,
            `<p>${errorMessage}</p><p>Usuario: ${userEmail}</p><p>Servicio: ${endpoint}</p>`
        );
    }

    private async sendMailToAdmins(subject: string, textBody: string, htmlBody: string): Promise<void> {
        const mailParams: SendEmailCommandInput = {
            Destination: {
                ToAddresses: [process.env.ADMIN_EMAIL as string],
            },
            Source: process.env.NOTIFICATION_EMAIL_USER!,
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Text: { Data: "Code" },
                    Html: { Data: htmlBody },
                },
            },
        };

        const sendCommand = new SendEmailCommand(mailParams);
        await this.ses.send(sendCommand)
    }

    private async sendMail(toAddresses: string[], subject: string, textBody: string, htmlBody: string): Promise<void> {
        const mailParams: SendEmailCommandInput = {
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

        const sendCommand = new SendEmailCommand(mailParams);
        await this.ses.send(sendCommand)
    }

    public async notifyNewBackOfficeUserToGeneratePassword(email: string, redirectUrl: string): Promise<void> {
        await this.sendMail([email], "Tu usuario fue creado", redirectUrl, redirectUrl);
    }

    public async notifyNewBackOfficeUserToRecoverPassword(email: string, code: string): Promise<void> {
        await this.sendMail([email], "Cambiar la contraseña", "", sendRecoverPasswordCodeTemplate(code));
    }

    public async notifyUserToGeneratePassword(email: string, redirectUrl: string): Promise<void> {
        await this.sendMail([email], "Tu usuario fue creado", redirectUrl, redirectUrl);
    }

    public async notifyCustomerAboutNewSubscriptionSuccessfullyCreated(dto: NewSubscriptionNotificationDto): Promise<void> {
        if (dto.planSku === "PLAHOR") await this.sendPlanAhorroMail(dto.customerEmail, dto.customerFirstName);
        else if (dto.planSku === "PLFML2" || dto.planSku === "PLVEGE")
            await this.sendVegPlanMail(
                dto.customerEmail,
                dto.customerFirstName,
                dto.planName,
                dto.recipeSelection,
                !!dto.hasIndicatedRestrictions
            );
        else
            await this.sendOtherPlanMail(
                dto.customerEmail,
                dto.customerFirstName,
                dto.planName,
                dto.recipeSelection,
                !!dto.hasIndicatedRestrictions
            );
        // else {
        //     await this.sendMail(
        //         [dto.customerEmail],
        //         `Hola ${dto.customerFirstName}, bienvenid@ a LetsCook!`,
        //         "",
        //         welcomeTemplate(
        //             dto.customerFirstName,
        //             dto.recipeSelection,
        //             dto.planName,
        //             !!dto.hasIndicatedRestrictions,
        //             dto.shippingCost,
        //             dto.firstOrderId,
        //             dto.shippingDay,
        //             dto.isPlanAhorro
        //         )
        //     );
        // }
    }

    public async notifyAdminsAboutNewSubscriptionsSuccessfullyCreated(
        customerEmail: string,
        customerName: string,
        planNames: string[]
    ): Promise<void> {
        await this.sendMailToAdmins("Nueva compra de un plan", "", newSubscriptionsTemplate(customerEmail, planNames));
    }

    public async notifyAdminsAboutNewSubscriptionSuccessfullyCreated(dto: NewSubscriptionNotificationDto): Promise<void> {
        await this.sendMailToAdmins(
            "Nueva compra de un plan",
            "",
            newSubscriptionTemplate(
                dto.customerFirstName,
                dto.recipeSelection,
                dto.planName,
                dto.hasIndicatedRestrictions,
                dto.shippingCost,
                dto.firstOrderId,
                dto.shippingDay,
                dto.isPlanAhorro
            )
        );
    }

    public async notifyCustomerAboutPaymentOrderBilled(dto: PaymentOrderBilledNotificationDto): Promise<void> {
        await this.sendMail([dto.customerEmail], `Tu ticket de LetsCook ${dto.paymentOrderHumanNumber}`, "", ticketTemplate(dto));
    }

    public async sendUpdateEmailEmail(userEmail: string, changeEmailUrl: string, locale: Locale): Promise<void> {
        await this.sendMail([userEmail], "Cambio de email", "", updateEmailTemplate(changeEmailUrl, locale));
    }

    /**
     * Getter ses
     * @return {SESClient}
     */
    public get ses(): SESClient {
        return this._ses;
    }
}
