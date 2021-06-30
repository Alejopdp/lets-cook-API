import { Plan } from "../../domain/plan/Plan";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { GetDataForSwappingAPlanDto } from "./getDataForSwappingAPlanDto";

export class GetDataForSwappingAPlan {
    private _subscriptionRepository: ISubscriptionRepository;
    private _planRepository: IPlanRepository;

    constructor(subscriptionRepository: ISubscriptionRepository, planRepository: IPlanRepository) {
        this._subscriptionRepository = subscriptionRepository;
        this._planRepository = planRepository;
    }
    public async execute(dto: GetDataForSwappingAPlanDto): Promise<{ subscription: Subscription; plans: Plan[] }> {
        const subscription: Subscription | undefined = await this.subscriptionRepository.findById(new SubscriptionId(dto.subscriptionId));
        if (!!!subscription) throw new Error("La suscripción ingresada no existe");

        const plans: Plan[] = await this.planRepository.findAll(dto.locale);

        return { subscription, plans };
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }
}
