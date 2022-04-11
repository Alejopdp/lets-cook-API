import { ActionExport, IExportService } from "../../application/exportService/IExportService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Customer } from "../../domain/customer/Customer";
import { Log } from "../../domain/customer/log/Log";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { ExportAllCustomersActionsDto } from "./exportAllCustomersActionsDto";

export class ExportAllCustomersActions {
    private _customerRepository: ICustomerRepository;
    private _logRepository: ILogRepository;
    private _exportService: IExportService;

    constructor(customerRepository: ICustomerRepository, exportService: IExportService, logRepository: ILogRepository) {
        this._customerRepository = customerRepository;
        this._logRepository = logRepository;
        this._exportService = exportService;
    }

    public async execute(dto: ExportAllCustomersActionsDto): Promise<void> {
        const logs: Log[] = await this.logRepository.findAllBetweenDate(dto.startDate ?? new Date(), dto.endDate ?? new Date());
        const customers: Customer[] = await this.customerRepository.findByIdList(logs.map((log) => log.customerId));
        const customersMap: { [customerId: string]: Customer } = {};
        const actionsForExport: ActionExport[] = [];

        for (const customer of customers) {
            customersMap[customer.id.toString()] = customer;
        }

        for (let log of logs) {
            const logDate = new Date(log.timestamp);
            actionsForExport.push({
                date: `${MomentTimeService.getDdMmYyyy(logDate)} ${logDate.getHours()}:${
                    (logDate.getMinutes() < 10 ? "0" : "") + logDate.getMinutes()
                }:${logDate.getSeconds()}`,
                user: log.user,
                role: log.role,
                "action type": log.type,
                "customer first name": customersMap[log.customerId.toString()]?.getPersonalInfo().name ?? "",
                "customer last name": customersMap[log.customerId.toString()]?.getPersonalInfo().lastName ?? "",
                "customer email": customersMap[log.customerId.toString()]?.email ?? "",
                action: log.action,
            });
        }

        this.exportService.exportAllCustomersActions(actionsForExport);
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
