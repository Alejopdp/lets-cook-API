import { ActionExport, IExportService } from "../../application/exportService/IExportService";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Log } from "../../domain/customer/log/Log";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { ExportCustomerActionsDto } from "./exportCustomerActionsDto";

export class ExportCustomerActions {
    private _customerRepository: ICustomerRepository;
    private _logRepository: ILogRepository;
    private _exportService: IExportService;

    constructor(customerRepository: ICustomerRepository, exportService: IExportService, logRepository: ILogRepository) {
        this._customerRepository = customerRepository;
        this._logRepository = logRepository;
        this._exportService = exportService;
    }

    public async execute(dto: ExportCustomerActionsDto): Promise<void> {
        const logs: Log[] = await this.logRepository.findAllByCustomer(new CustomerId(dto.customerId));
        const actionsForExport: ActionExport[] = [];

        for (let log of logs) {
            const logDate = new Date(log.timestamp);
            actionsForExport.push({
                date: logDate.getDate() + "-" + logDate.getMonth() + 1 + "-" + logDate.getFullYear(),
                user: log.user,
                role: log.role,
                action: log.action,
            });
        }

        this.exportService.exportCustomerActions(actionsForExport);
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }

    /**
     * Getter exportService
     * @return {IExportService}
     */
    public get exportService(): IExportService {
        return this._exportService;
    }
}
