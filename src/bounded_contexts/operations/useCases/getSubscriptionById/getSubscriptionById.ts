import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Order } from "../../domain/order/Order";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { GetSubscriptionByIdDto } from "./getSubscriptionByIdDto";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { Customer } from "../../domain/customer/Customer";
import { logger } from "../../../../../config";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { Week } from "../../domain/week/Week";
import { WeekId } from "../../domain/week/WeekId";

export class GetSubscriptionById {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _weekRepository: IWeekRepository;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        weekRepository: IWeekRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._weekRepository = weekRepository;
    }

    public async execute(
        dto: GetSubscriptionByIdDto
    ): Promise<{ subscription: Subscription; orders: Order[]; customer: Customer; paymentOrders: PaymentOrder[] }> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const [subscription, orders]: [Subscription, Order[]] = await Promise.all([
            this.subscriptionRepository.findByIdOrThrow(subscriptionId),
            this.orderRepository.findNextTwelveBySubscription(subscriptionId),
        ]);
        const currentAndNextWeeksIds: WeekId[] = [orders[0]?.week, orders[1]?.week].reduce(
            (acc, week) => (!!week ? [...acc, week.id] : acc),
            [] as WeekId[]
        );
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByWeeks(currentAndNextWeeksIds);

        console.log("PaymentOrders: ", paymentOrders);

        return { subscription, orders, customer: subscription.customer, paymentOrders };
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

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }
}
