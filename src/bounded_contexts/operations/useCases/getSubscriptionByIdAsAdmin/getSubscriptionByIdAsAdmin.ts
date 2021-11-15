import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Order } from "../../domain/order/Order";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { GetSubscriptionByIdAsAdminDto } from "./getSubscriptionByIdAsAdminDto";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { Customer } from "../../domain/customer/Customer";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { PaymentOrderId } from "../../domain/paymentOrder/PaymentOrderId";
import { Locale } from "../../domain/locale/Locale";

export class GetSubscriptionByIdAsAdmin {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
    }

    public async execute(
        dto: GetSubscriptionByIdAsAdminDto
    ): Promise<{ subscription: Subscription; orders: Order[]; customer: Customer; nextPaymentOrder?: PaymentOrder }> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const subscription: Subscription | undefined = await this.subscriptionRepository.findById(subscriptionId);
        if (!!!subscription) throw new Error("La subscripción ingresada no existe");

        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscription(subscriptionId, Locale.es);
        const nextActiveOrder: Order | undefined = subscription.getNextActiveOrder(orders);
        const nextPaymentOrder: PaymentOrder | undefined = !!nextActiveOrder
            ? await this.paymentOrderRepository.findById(nextActiveOrder.paymentOrderId!, dto.locale)
            : undefined;

        return { subscription, orders, customer: subscription.customer, nextPaymentOrder };
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
     * Getter orderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }
}
