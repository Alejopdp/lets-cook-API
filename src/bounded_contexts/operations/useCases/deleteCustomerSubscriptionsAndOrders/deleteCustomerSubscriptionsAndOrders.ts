import { CustomerId } from "../../domain/customer/CustomerId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { DeleteCustomerSubscriptionsAndOrdersDto } from "./deleteCustomerSubscriptionsAndOrdersDto";

export class DeleteCustomerSubscriptionsAndOrders {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;

    constructor(subscriptionRepository: ISubscriptionRepository, orderRepository: IOrderRepository, paymentOrderRepository: IPaymentOrderRepository) {
        this._subscriptionRepository = subscriptionRepository
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository
    }
    public async execute(dto: DeleteCustomerSubscriptionsAndOrdersDto): Promise<void> {
        const customerId = new CustomerId(dto.customerId)
        await Promise.all([this.orderRepository.destroyByCustomerId(customerId), this.paymentOrderRepository.destroyByCustomerId(customerId), this.subscriptionRepository.destroyManyByCustomer(customerId)])

    }


    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

}