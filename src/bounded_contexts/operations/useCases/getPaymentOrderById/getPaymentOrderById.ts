import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { Subscription } from "../../domain/subscription/Subscription";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { GetPaymentOrderByIdDto } from "./getPaymentOrderByIdDto";

export class GetPaymentOrderById {
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _orderRepository: IOrderRepository;
    private _customerRepository: ICustomerRepository;
    private _subscriptionRepository: ISubscriptionRepository;

    constructor(
        paymentOrderRepository: IPaymentOrderRepository,
        orderRepository: IOrderRepository,
        customerRepository: ICustomerRepository,
        subscriptionRepository: ISubscriptionRepository
    ) {
        this._paymentOrderRepository = paymentOrderRepository;
        this._orderRepository = orderRepository;
        this._customerRepository = customerRepository;
        this._subscriptionRepository = subscriptionRepository;
    }

    public async execute(
        dto: GetPaymentOrderByIdDto
    ): Promise<{ paymentOrder: PaymentOrder; orders: Order[]; customer: Customer; subscriptions: Subscription[] }> {
        const paymentOrderId: PaymentOrderId = new PaymentOrderId(dto.paymentOrderId);
        const paymentOrder: PaymentOrder = await this.paymentOrderRepository.findByIdOrThrow(paymentOrderId);
        const orders: Order[] = await this.orderRepository.findByPaymentOrderId(paymentOrderId);
        const customer: Customer = await this.customerRepository.findByIdOrThrow(paymentOrder.customerId);
        const subscriptions: Subscription[] = await this.subscriptionRepository.findByIdList(
            orders.filter((order) => order.discountAmount > 0).map((order) => order.subscriptionId)
        );

        return { paymentOrder, orders, customer, subscriptions };
    }

    /**
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }
}
