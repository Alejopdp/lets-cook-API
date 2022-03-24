import { Log } from "../../../domain/customer/log/Log";
import { Log as MongooseLog } from "../../../../../infraestructure/mongoose/models";
import { logMapper } from "../../../mappers";
import { ILogRepository } from "./ILogRepository";
import { CustomerId } from "../../../domain/customer/CustomerId";

export class MongooseLogRepository implements ILogRepository {
    public async save(log: Log): Promise<void> {
        const logToSave = logMapper.toPersistence(log);

        await MongooseLog.create(logToSave);
    }
    public async findAll(): Promise<Log[]> {
        const dbLogs = await MongooseLog.find({}).sort({ createdAt: -1 });

        return dbLogs.map((log: any) => logMapper.toDomain(log));
    }

    public async findAllByCustomer(customerId: CustomerId): Promise<Log[]> {
        const dbLogs = await MongooseLog.find({ customerId: customerId.toString() }).sort({ createdAt: -1 });

        return dbLogs.map((log: any) => logMapper.toDomain(log));
    }
}
