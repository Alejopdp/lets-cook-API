import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { OrderId } from "../../domain/order/OrderId";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Subscription } from "../../domain/subscription/Subscription";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { GetOrderByIdDto } from "./getOrderByIdDto";

export class GetOrderById {
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
        dto: GetOrderByIdDto
    ): Promise<{ paymentOrder: PaymentOrder; order: Order; customer: Customer; subscription: Subscription }> {
        const orderId: OrderId = new OrderId(dto.orderId);
        const order: Order = await this.orderRepository.findByIdOrThrow(orderId, dto.locale);
        const paymentOrder: PaymentOrder = await this.paymentOrderRepository.findByIdOrThrow(order.paymentOrderId!);
        const customer: Customer = await this.customerRepository.findByIdOrThrow(paymentOrder.customerId);
        const subscription: Subscription = await this.subscriptionRepository.findByIdOrThrow(order.subscriptionId, dto.locale);

        return { paymentOrder, order, customer, subscription };
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
