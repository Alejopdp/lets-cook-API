import { Customer } from "../../domain/customer/Customer";
import { CustomerId } from "../../domain/customer/CustomerId";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { GetPaymentOrdersAsAdminDto } from "./getPaymentOrdersAsAdminDto";

export class GetPaymentOrdersAsAdmin {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _customerRepository: ICustomerRepository;

    constructor(paymentOrderRepository: IPaymentOrderRepository, _customerRepository: ICustomerRepository) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._customerRepository = _customerRepository;
    }

    public async execute(dto: GetPaymentOrdersAsAdminDto): Promise<{ paymentOrders: PaymentOrder[]; customers: Customer[] }> {
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findAll(dto.locale);
        var customersIds: CustomerId[] = [];

        for (let paymentOrder of paymentOrders) {
            if (!customersIds.some((id) => id.equals(paymentOrder.customerId))) customersIds = [paymentOrder.customerId, ...customersIds];
        }

        const customers: Customer[] = await this.customerRepository.findByIdList(customersIds);

        return { paymentOrders, customers };
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }
}
