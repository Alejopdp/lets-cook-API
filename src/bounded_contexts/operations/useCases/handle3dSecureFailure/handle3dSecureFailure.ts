import { Handle3dSecureFailureDto } from "./handle3dSecureFailureDto";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Order } from "../../domain/order/Order";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { CancellationReason } from "../../domain/cancellationReason/CancellationReason";

export class Handle3dSecureFailure {
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

    public async execute(dto: Handle3dSecureFailureDto): Promise<void> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const subscription: Subscription = await this.subscriptionRepository.findByIdOrThrow(subscriptionId);
        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscription(subscriptionId);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!));

        subscription.cancel(new CancellationReason("Método de pago no confirmado", ""), orders, paymentOrders);

        await this.subscriptionRepository.save(subscription);
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
