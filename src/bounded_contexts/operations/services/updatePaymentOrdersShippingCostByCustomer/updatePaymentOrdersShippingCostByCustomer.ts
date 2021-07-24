import { Customer } from "../../domain/customer/Customer";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";

export class UpdatePaymentOrdersShippingCostByCustomer {
    private _paymentOrderRepository: IPaymentOrderRepository;

    constructor(paymentOrderRepository: IPaymentOrderRepository) {
        this._paymentOrderRepository = paymentOrderRepository;
    }

    public async execute(customer: Customer, newShippingCost: number): Promise<void> {
        const paymentOrdersToUpdate = await this.paymentOrderRepository.findByCustomerId(customer.id);

        for (let paymentOrder of paymentOrdersToUpdate) {
            paymentOrder.shippingCost = newShippingCost;
        }
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }
}
