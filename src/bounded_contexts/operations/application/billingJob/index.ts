import { awsSesService } from "../../../../shared/notificationService";
import { payAllSubscriptions } from "../../services/payAllSubscriptions";
import { BillingJob } from "./billingJob";

export const billingJob: BillingJob = new BillingJob(payAllSubscriptions, awsSesService);
