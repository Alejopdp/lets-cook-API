import { CancellationReason } from "../../domain/cancellationReason/CancellationReason";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { CancelASubscriptionDto } from "./cancelASubscriptionDto";

export class CancelASubscription {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;

    constructor(subscriptionRepository: ISubscriptionRepository, orderRepository: IOrderRepository) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
    }

    public async execute(dto: CancelASubscriptionDto): Promise<void> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const cancellationReason: CancellationReason = new CancellationReason(dto.cancellationReason, dto.cancellationComment);
        const subscription: Subscription | undefined = await this.subscriptionRepository.findById(subscriptionId);
        if (!!!subscription) throw new Error("La suscripción ingresada no existe");

        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscription(subscriptionId);

        subscription.cancel(cancellationReason, orders);

        await this.orderRepository.saveCancelledOrders(orders); // TO DO: Transaction / Queue
        await this.subscriptionRepository.save(subscription); // TO DO: Transaction / Queue
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
