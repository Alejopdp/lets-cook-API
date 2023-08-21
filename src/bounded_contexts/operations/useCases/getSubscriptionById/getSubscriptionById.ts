import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Order } from "../../domain/order/Order";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { GetSubscriptionByIdDto } from "./getSubscriptionByIdDto";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { Customer } from "../../domain/customer/Customer";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { WeekId } from "../../domain/week/WeekId";
import { GetSubscriptionByIdPresenter, GetSubscriptionByIdResponse } from "./getSubscriptionByIdPresenter";

export class GetSubscriptionById {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _weekRepository: IWeekRepository;
    private _presenter: GetSubscriptionByIdPresenter;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        weekRepository: IWeekRepository,
        presenter: GetSubscriptionByIdPresenter
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._weekRepository = weekRepository;
        this._presenter = presenter;
    }

    public async execute(
        dto: GetSubscriptionByIdDto
    ): Promise<GetSubscriptionByIdResponse> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const [subscription, orders]: [Subscription, Order[]] = await Promise.all([
            this.subscriptionRepository.findByIdOrThrow(subscriptionId, dto.locale),
            this.orderRepository.findNextTwelveBySubscription(subscriptionId, dto.locale, dto.queryDate),
        ]);
        const currentAndNextWeeksIds: WeekId[] = [orders[0]?.week, orders[1]?.week].reduce(
            (acc, week) => (!!week ? [...acc, week.id] : acc),
            [] as WeekId[]
        );
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByWeeks(currentAndNextWeeksIds);

        return await this.presenter.present(subscription, orders, subscription.customer, paymentOrders, dto.locale, dto.queryDate)
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

    /**
     * Getter presenter
     * @return {GetSubscriptionByIdPresenter}
     * */
    public get presenter(): GetSubscriptionByIdPresenter {
        return this._presenter;
    }

}
