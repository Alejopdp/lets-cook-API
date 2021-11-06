import { IMailingListService } from "./IMailingListService";
import { MailerLiteService } from "./mailerLiteService";

export const mailerLiteService: IMailingListService = new MailerLiteService();
