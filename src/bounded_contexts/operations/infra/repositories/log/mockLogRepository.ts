import { CustomerId } from "@src/bounded_contexts/operations/domain/customer/CustomerId";
import { Log } from "@src/bounded_contexts/operations/domain/customer/log/Log";
import { ILogRepository } from "./ILogRepository";

export class InMemoryLogRepository implements ILogRepository {

    private logs: Log[] = [];

    public constructor(logs: Log[]) {
        this.logs = logs;
    }

    public async save(log: Log): Promise<void> {
        this.logs.push(log)
    }

    findAll(): Promise<Log[]> {
        throw new Error("Method not implemented.");
    }
    findAllBetweenDate(startDate: Date, endDate: Date): Promise<Log[]> {
        throw new Error("Method not implemented.");
    }
    public async findAllByCustomer(customerId: CustomerId): Promise<Log[]> {
        return this.logs.filter(log => log.customerId.toString() === customerId.toString());
    }
}