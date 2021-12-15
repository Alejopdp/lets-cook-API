import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { DeleteSubscriptionDto } from "./deleteSubscriptionDto";

export class DeleteSubscription {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;

    constructor(subscriptionRepository: ISubscriptionRepository, orderRepository: IOrderRepository) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
    }

    public async execute(dto: DeleteSubscriptionDto): Promise<any> {
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);

        await this.orderRepository.destroyManyBySubscriptionId(subscriptionId);
        await this.subscriptionRepository.destroy(subscriptionId);
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
