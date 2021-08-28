import { CustomerId } from "../../domain/customer/CustomerId";
import { Customer } from "../../domain/customer/Customer";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { AddPaymentMethodDto } from "./addPaymentMethodDto";
import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";

export class AddPaymentMethod {
    private _customerRepository: ICustomerRepository;
    private _paymentService: IPaymentService;

    constructor(customerRepository: ICustomerRepository, paymentService: IPaymentService) {
        this._customerRepository = customerRepository;
        this._paymentService = paymentService;
    }

    public async execute(dto: AddPaymentMethodDto): Promise<PaymentMethod> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer | undefined = await this.customerRepository.findByIdOrThrow(customerId);
        const newPaymentMethod: PaymentMethod = await this.paymentService.addPaymentMethodToCustomer(dto.stripeId, customer.stripeId);

        customer.addPaymentMethodAndSetItAsDefault(newPaymentMethod);

        await this.customerRepository.save(customer);

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
}
