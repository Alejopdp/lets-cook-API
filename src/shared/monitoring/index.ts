import { IMonitoringService } from "./IMonitoringService";
import { SentryService } from "./sentryService";

export const sentryService: IMonitoringService = new SentryService();
