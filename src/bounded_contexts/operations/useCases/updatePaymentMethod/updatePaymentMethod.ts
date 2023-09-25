import { IStorageService } from "../../application/storageService/IStorageService";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { UpdatePaymentMethodDto } from "./updatePaymentMethodDto";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";
import { WalletMovementLogType } from "../../domain/customer/wallet/WalletMovementLog/WalletMovementLogTypeEnum";

export class UpdatePaymentMethod {
    private _customerRepository: ICustomerRepository;
    private _storageService: IStorageService;
    private _logRepository: ILogRepository;

    constructor(customerRepository: ICustomerRepository, storageService: IStorageService, logRepository: ILogRepository) {
        this._customerRepository = customerRepository;
        this._storageService = storageService;
        this._logRepository = logRepository;
    }

    public async execute(dto: UpdatePaymentMethodDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findById(customerId);
        if (!customer) throw new Error("Error al buscar el cliente");

        customer.changePaymentMethod(
            dto.paymentId,
            dto.brand,
            dto.last4Numbers,
            dto.exp_month,
            dto.exp_year,
            dto.cvc,
            dto.stripeId,
            dto.isDefault
        );
        await this.customerRepository.save(customer);

        this.logRepository.save(
            new Log(
                LogType.CREDIT_CARD_UPDATED,
                dto.nameOrEmailOfAdminExecutingRequest || customer.getFullNameOrEmail(),
                !!dto.nameOrEmailOfAdminExecutingRequest ? "Admin" : "Usuario",
                `Se marcó la tarjeta terminada en ${customer.getDefaultPaymentMethod()?.last4Numbers} como default`,
                `Se marcó el método ${customer.getDefaultPaymentMethod()?.id.toString()} como default`,
                new Date(),
                customer.id
            )
        );

        if (dto.paymentId === "wallet") customer.addWalletMovementLog(WalletMovementLogType.SELECT_WALLET_AS_DEFAULT, 0)
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
