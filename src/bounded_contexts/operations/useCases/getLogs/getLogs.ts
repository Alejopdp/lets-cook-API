import { CustomerId } from "../../domain/customer/CustomerId";
import { Log } from "../../domain/customer/log/Log";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { GetLogsDto } from "./getLogsDto";

export class GetLogs {
    private _logRepository: ILogRepository;

    constructor(logRepository: ILogRepository) {
        this._logRepository = logRepository;
    }

    public async execute(dto: GetLogsDto): Promise<Log[]> {
        const customerId: CustomerId | undefined = !!dto.customerId ? new CustomerId(dto.customerId) : undefined;

        const logs: Log[] = !!customerId ? await this.logRepository.findAllByCustomer(customerId) : await this.logRepository.findAll();

        return logs;
    }

    /**
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }
}
