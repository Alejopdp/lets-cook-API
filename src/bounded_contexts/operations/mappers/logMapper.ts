import { Mapper } from "../../../core/infra/Mapper";
import { CustomerId } from "../domain/customer/CustomerId";
import { Log } from "../domain/customer/log/Log";

export class LogMapper implements Mapper<Log> {
    public toDomain(raw: any): Log {
        return new Log(raw.type, raw.user, raw.role, raw.action, raw.debugAction, raw.createdAt, new CustomerId(raw.customerId));
    }
    public toPersistence(t: Log): any {
        return {
            type: t.type,
            user: t.user,
            role: t.role,
            action: t.action,
            debugAction: t.debugAction,
            customerId: t.customerId.toString(),
        };
    }
}
