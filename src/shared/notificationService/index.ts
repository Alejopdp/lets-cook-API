import { INotificationService } from "./INotificationService";
import aws from "aws-sdk";
import { AwsSesService } from "./awsSesService";

const ses = new aws.SES({
    region: "eu-west-3",
    credentials: { accessKeyId: process.env.SES_ACCES_KEY_ID!, secretAccessKey: process.env.SES_SECRET_ACCES_ID! },
});

export const awsSesService: INotificationService = new AwsSesService(ses);
