import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IPaymentService } from "../paymentService/IPaymentService";
import { FuturePaymentSetupDto } from "./futurePaymentSetupDto";

export class FuturePaymentSetup {
    private _customerRepository: ICustomerRepository;
    private _paymentService: IPaymentService;

    constructor(customerRepository: ICustomerRepository, paymentService: IPaymentService) {
        this._customerRepository = customerRepository;
        this._paymentService = paymentService;
    }

    public async execute(dto: FuturePaymentSetupDto): Promise<{ client_secret: string | null }> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const customer: Customer = await this.customerRepository.findByIdOrThrow(customerId);
        const setupIntent = await this.paymentService.setupIntent(customer.stripeId, "off_session");

        return { client_secret: setupIntent.client_secret };
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
