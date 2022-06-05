import { CustomerId } from "@src/bounded_contexts/operations/domain/customer/CustomerId";
import { Log } from "@src/bounded_contexts/operations/domain/customer/log/Log";

export interface ILogRepository {
    save(log: Log): Promise<void>;
    findAll(): Promise<Log[]>;
    findAllBetweenDate(startDate: Date, endDate: Date): Promise<Log[]>
    findAllByCustomer(customerId: CustomerId): Promise<Log[]>;

}
