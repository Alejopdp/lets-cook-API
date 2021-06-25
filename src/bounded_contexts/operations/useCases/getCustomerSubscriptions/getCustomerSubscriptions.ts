import { CustomerId } from "../../domain/customer/CustomerId";
import { Plan } from "../../domain/plan/Plan";
import { Subscription } from "../../domain/subscription/Subscription";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { GetCustomerSubscriptionsDto } from "./getCustomerSubscriptionsDto";
import { GetCustomerSubscriptionPresenter } from "./getCustomerSubscriptionsPresenter";

export class GetCustomerSubscriptions {
    private _subscriptionRepository: ISubscriptionRepository;
    private _planRepository: IPlanRepository;

    constructor(subscriptionRepository: ISubscriptionRepository, planRepository: IPlanRepository) {
        this._subscriptionRepository = subscriptionRepository;
        this._planRepository = planRepository;
    }

    public async execute(dto: GetCustomerSubscriptionsDto): Promise<any> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        // const subscriptions: Subscription[] = await this.subscriptionRepository.findByCustomerId(customerId);
        // const plan: Plan = await this.planRepository.findByPlanVariantId()

        return GetCustomerSubscriptionPresenter.present([]);
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
