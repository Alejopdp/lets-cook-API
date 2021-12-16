import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { AddPaymentMethodDto } from "./addPaymentMethodDto";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";

export class AddPaymentMethod {
    private _customerRepository: ICustomerRepository;
    private _paymentService: IPaymentService;
    private _logRepository: ILogRepository;

    constructor(customerRepository: ICustomerRepository, paymentService: IPaymentService, logRepository: ILogRepository) {
        this._customerRepository = customerRepository;
        this._paymentService = paymentService;
        this._logRepository = logRepository;
    }

    public async execute(dto: AddPaymentMethodDto): Promise<PaymentMethod> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findByIdOrThrow(customerId);
        const newPaymentMethod = await this.paymentService.getPaymentMethod(dto.stripeId);

        customer.addPaymentMethodAndSetItAsDefault(
            new PaymentMethod(
                newPaymentMethod.card?.brand!,
                newPaymentMethod.card?.last4!,
                newPaymentMethod.card?.exp_month!,
                newPaymentMethod.card?.exp_year!,
                newPaymentMethod.card?.checks?.cvc_check!,
                false,
                newPaymentMethod.id
            )
        );

        await this.customerRepository.save(customer);
        this.logRepository.save(
            new Log(
                LogType.CREDIT_CARD_UPDATED,
                dto.nameOrEmailOfAdminExecutingRequest || customer.getFullNameOrEmail(),
                !!dto.nameOrEmailOfAdminExecutingRequest ? "Admin" : "Usuario",
                `Se agregó un método de pago terminado en ${customer.getDefaultPaymentMethod()?.last4Numbers}`,
                `Se agregó el método de pago ${customer.getDefaultPaymentMethod()?.id.toString()}`,
                new Date(),
                customer.id
            )
        );

        return customer.getDefaultPaymentMethod()!;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter paymentService
     * @return {IPaymentService}
     */
    public get paymentService(): IPaymentService {
        return this._paymentService;
    }

    /**
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }
}
