import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderActive } from "../../domain/paymentOrder/paymentOrderState/PaymentOrderActive";
import { Subscription } from "../../domain/subscription/Subscription";
import { Week } from "../../domain/week/Week";
import { ICustomerRepository } from "../../infra/repositories/customer/ICustomerRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";

export class PayAllSubscriptions {
    private _customerRepository: ICustomerRepository;
    private _weekRepository: IWeekRepository;
    private _orderRepository: IOrderRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _paymentOrder: IPaymentOrderRepository;

    constructor(
        customerRepository: ICustomerRepository,
        weekRepository: IWeekRepository,
        orderRepository: IOrderRepository,
        subscriptionRepository: ISubscriptionRepository,
        paymentOrder: IPaymentOrderRepository
    ) {
        this._customerRepository = customerRepository;
        this._weekRepository = weekRepository;
        this._orderRepository = orderRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._paymentOrder = paymentOrder;
    }

    public async execute(): Promise<void> {
        const customers: Customer[] = await this.customerRepository.findAll();
        const subscriptions: Subscription[] = await this.subscriptionRepository.findActiveSusbcriptionsByCustomerIdList(
            customers.map((customer) => customer.id)
        );
        const week: Week | undefined = await this.weekRepository.findNextWeek();
        if (!!!week) throw new Error("Error al obtener la semana próxima");

        const orders: Order[] = await this.orderRepository.findForBilling(
            subscriptions.map((subscription) => subscription.id),
            week
        );

        const subscriptionCustomerMap: { [subscriptionId: string]: string | number } = {};
        const customerOrderMap: { [customerId: string]: Order[] } = {};

        for (let subscription of subscriptions) {
            subscriptionCustomerMap[subscription.id.value.toString()] = subscription.customer.id.value;
        }

        for (let order of orders) {
            const actualKey = customerOrderMap[subscriptionCustomerMap[order.subscriptionId.value]];
            customerOrderMap[subscriptionCustomerMap[order.subscriptionId.value]] = Array.isArray(actualKey) ? [...actualKey, order] : [];
        }

        const paymentOrders: PaymentOrder[] = [];

        for (let customer of customers) {
            const shippingDate = new Date(); // TO DO: Maybe not necessary
            const amountOfORders = customerOrderMap[customer.id.value].reduce((acc, order) => acc + order.price, 0);

            paymentOrders.push(
                new PaymentOrder(shippingDate, new PaymentOrderActive(), "", new Date(), week, amountOfORders, 0, 0, customer.id)
            );
        }
    }

    /**
     * Getter customerRepository
     * @return {ICustomerRepository}
     */
    public get customerRepository(): ICustomerRepository {
        return this._customerRepository;
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }

    /**
     * Getter paymentOrder
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrder(): IPaymentOrderRepository {
        return this._paymentOrder;
    }
}
