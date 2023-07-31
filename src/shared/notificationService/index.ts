import { INotificationService } from "./INotificationService";
import aws from "aws-sdk";
import { AwsSesService } from "./awsSesService";
import { AwsV3SesService } from "./awsSesV3Service";

const ses = new aws.SES({
    region: "eu-west-3",
    credentials: { accessKeyId: process.env.SES_ACCES_KEY_ID!, secretAccessKey: process.env.SES_SECRET_ACCES_ID! },
});

export const awsSesService: INotificationService = new AwsSesService(ses);
export const awsSesV3Service: INotificationService = new AwsV3SesService();
