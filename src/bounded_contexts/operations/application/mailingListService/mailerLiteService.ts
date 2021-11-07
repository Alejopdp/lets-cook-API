import { IMailingListService } from "./IMailingListService";
import axios from "axios";

export class MailerLiteService implements IMailingListService {
    public async updateSubscriber(email: string, data: object): Promise<any> {
        const res = await axios({
            method: "PUT",
            headers: {
                Accept: "application/json",
                "X-MailerLite-ApiDocs": "true",
                "Content-Type": "application/json",
                "X-MailerLite-ApiKey": process.env.MAILER_LITE_API_KEY,
            },
            //@ts-ignore
            data: data.name ? { fields: data, name: data.name } : { fields: data },
            url: `https://api.mailerlite.com/api/v2/subscribers/${email}`,
        });
        return res && res.status === 200 ? "" : res.data.error?.message || "Ocurrió un error inesperado al suscribir al cliente";
    }

    public async createSubscriber(newSubscriberEmail: string, data: any): Promise<any> {
        const res = await axios({
            method: "POST",
            headers: {
                Accept: "application/json",
                "X-MailerLite-ApiDocs": "true",
                "Content-Type": "application/json",
                "X-MailerLite-ApiKey": process.env.MAILER_LITE_API_KEY,
            },
            data: { email: newSubscriberEmail, resubscribe: false, type: "null" },
            url: `https://api.mailerlite.com/api/v2/subscribers`,
        });
        return res && res.status === 200 ? "" : res.data.error?.message || "Ocurrió un error inesperado al suscribir al cliente";
    }

    public async subscribeTo(groupId: string, newSubscriberEmail: string, newSusbcriberFullName: string): Promise<string> {
        const res = await axios({
            method: "POST",
            headers: {
                Accept: "application/json",
                "X-MailerLite-ApiDocs": "true",
                "Content-Type": "application/json",
                "X-MailerLite-ApiKey": process.env.MAILER_LITE_API_KEY,
            },
            data: { email: newSubscriberEmail, resubscribe: true, type: "null" },
            url: `https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`,
        });
        return res && res.status === 200 ? "" : res.data.error?.message || "Ocurrió un error inesperado al suscribir al cliente";
    }

    public async getSubscribersOfGorup(groupId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public async getGroups(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

    public async getGroupById(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
