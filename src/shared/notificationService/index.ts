import { INotificationService } from "./INotificationService";
import { AwsV3SesService } from "./awsSesV3Service";

export const awsSesV3Service: INotificationService = new AwsV3SesService();
