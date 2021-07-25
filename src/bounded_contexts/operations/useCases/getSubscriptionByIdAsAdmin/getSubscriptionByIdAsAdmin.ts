import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Order } from "../../domain/order/Order";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { GetSubscriptionByIdAsAdminDto } from "./getSubscriptionByIdAsAdminDto";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { Customer } from "../../domain/customer/Customer";

export class GetSubscriptionByIdAsAdmin {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;

    constructor(subscriptionRepository: ISubscriptionRepository, orderRepository: IOrderRepository) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
    }

    public async execute(dto: GetSubscriptionByIdAsAdminDto): Promise<{ subscription: Subscription; orders: Order[]; customer: Customer }> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const subscription: Subscription | undefined = await this.subscriptionRepository.findById(subscriptionId);
        if (!!!subscription) throw new Error("La subscripción ingresada no existe");

        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscription(subscriptionId);

        return { subscription, orders, customer: subscription.customer };
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
