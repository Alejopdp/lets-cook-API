import { INotificationService } from "./INotificationService";
import { NodemailerService } from "./nodemailerService";

export const nodemailerService: INotificationService = NodemailerService.create(
    process.env.NOTIFICATION_EMAIL_USER,
    process.env.NOTIFICATION_EMAIL_PASSWORD
);
