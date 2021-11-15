import { CustomerId } from "../../domain/customer/CustomerId";
import { Order } from "../../domain/order/Order";
import { Plan } from "../../domain/plan/Plan";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { GetCustomerSubscriptionsDto } from "./getCustomerSubscriptionsDto";

export class GetCustomerSubscriptions {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;

    constructor(subscriptionRepository: ISubscriptionRepository, orderRepository: IOrderRepository) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
    }

    public async execute(dto: GetCustomerSubscriptionsDto): Promise<{ subscriptions: Subscription[]; nextOrders: Order[] }> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const subscriptions: Subscription[] = await this.subscriptionRepository.findByCustomerId(customerId);
        const subscriptionsIds: SubscriptionId[] = subscriptions.map((subscription) => subscription.id);
        const nextOrders: Order[] = await this.orderRepository.findNextTwelveBySubscriptionList(subscriptionsIds, dto.locale);

        return { subscriptions, nextOrders };
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
}
