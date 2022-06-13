import { IStorageService } from "../../application/storageService/IStorageService";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdateCustomerBillingDto } from "./updateCustomerBillingDto";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";

export class UpdateCustomerBilling {
    private _customerRepository: ICustomerRepository;
    private _storageService: IStorageService;
    private _logRepository: ILogRepository;

    constructor(customerRepository: ICustomerRepository, storageService: IStorageService, logRepository: ILogRepository) {
        this._customerRepository = customerRepository;
        this._storageService = storageService;
        this._logRepository = logRepository;
    }

    public async execute(dto: UpdateCustomerBillingDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findById(customerId);

        if (!customer) throw new Error("Error al buscar el cliente");

        customer.changeBillingAddress(dto.lat, dto.long, dto.addressName, dto.customerName, dto.details, dto.identification, dto.city, dto.province, dto.country, dto.postalCode);

        await this.customerRepository.save(customer);
        this.logRepository.save(
            new Log(
                LogType.BILLING_ADDRESS_UPDATED,
                dto.nameOrEmailOfAdminExecutingRequest || customer.getFullNameOrEmail(),
                !!dto.nameOrEmailOfAdminExecutingRequest ? "Admin" : "Usuario",
                `El usuario cambió su dirección de facturación a ${customer.billingAddress?.addressName}`,
                `El usuario cambió su dirección de facturación a ${customer.billingAddress?.addressName}`,
                new Date(),
                customer.id
            )
        );
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }

    /**
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }
}
