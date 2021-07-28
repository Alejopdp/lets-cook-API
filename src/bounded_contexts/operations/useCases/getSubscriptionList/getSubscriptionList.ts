import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { GetSubscriptionListDto } from "./getSubscriptionListDto";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";

export class GetSubscriptionList {
    private _subscriptionRepository: ISubscriptionRepository;

    constructor(subscriptionRepository: ISubscriptionRepository) {
        this._subscriptionRepository = subscriptionRepository;
    }

    public async execute(dto: GetSubscriptionListDto): Promise<Subscription[]> {
        const subscriptions: Subscription[] = await this.subscriptionRepository.findAll(dto.locale);

        return subscriptions;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }
}
