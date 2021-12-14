import { Log } from "../../domain/customer/log/Log";
import { MomentTimeService } from "../../application/timeService/momentTimeService";

export class GetLogsPresenter {
    public present(logs: Log[]): any {
        return logs.map((log) => ({
            type: log.type,
            user: log.user,
            role: log.role,
            action: log.action,
            debugAction: log.debugAction,
            customerId: log.customerId.toString(),
            timestamp: MomentTimeService.getDdMmYyyy(log.timestamp),
        }));
    }
}
