import { Handle3dSecureFailureForManySubscriptionsDto } from "./handle3dSecureFailureForManySubscriptionsDto";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Order } from "../../domain/order/Order";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { CancellationReason } from "../../domain/cancellationReason/CancellationReason";
import { Locale } from "../../domain/locale/Locale";

export class Handle3dSecureFailureForManySubscriptions {
    private _subscriptionRepository: ISubscriptionRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _orderRepository: IOrderRepository;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        orderRepository: IOrderRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._orderRepository = orderRepository;
    }

    public async execute(dto: Handle3dSecureFailureForManySubscriptionsDto): Promise<void> {
        const subscriptionsIds: SubscriptionId[] = dto.subscriptionsIds.map((id) => new SubscriptionId(id));
        const subscriptions: Subscription[] = await this.subscriptionRepository.findByIdList(subscriptionsIds);
        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscriptionList(subscriptionsIds, Locale.es);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!));

        for (let subscription of subscriptions) {
            subscription.cancel(new CancellationReason("Método de pago no confirmado", ""), orders, paymentOrders);
        }

        // for (let paymentOrder of paymentOrders) {
        //     const ordersOfPaymentOrder: Order[] = orders.filter((order) => order.paymentOrderId?.equals(paymentOrder.id))!;
        //     const ordersTotalAmount = ordersOfPaymentOrder.reduce((acc, order) => (acc += order.getTotalPrice()), 0);

        //     if (paymentOrder.amount === ordersTotalAmount) {
        //         paymentOrder.toCancelled([]);
        //     } else {
        //         paymentOrder.discountOrdersAmount(ordersOfPaymentOrder);
        //     }
        // }

        await this.subscriptionRepository.saveCancelledSubscriptions(subscriptions);
        await this.paymentOrderRepository.updateMany(paymentOrders);
        await this.orderRepository.saveCancelledOrders(orders);
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
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
}
