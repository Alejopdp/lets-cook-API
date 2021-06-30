import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Order } from "../../domain/order/Order";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { SwapSubscriptionPlanDto } from "./swapSubscriptionPlanDto";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Subscription } from "../../domain/subscription/Subscription";
import { Customer } from "../../domain/customer/Customer";
import { logger } from "../../../../../config";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { PlanVariantId } from "../../domain/plan/PlanVariant/PlanVariantId";
import { PlanId } from "../../domain/plan/PlanId";
import { Plan } from "../../domain/plan/Plan";
import { Locale } from "../../domain/locale/Locale";

export class SwapSubscriptionPlan {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _planRepository: IPlanRepository;

    constructor(subscriptionRepository: ISubscriptionRepository, orderRepository: IOrderRepository, planRepository: IPlanRepository) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._planRepository = planRepository;
    }

    public async execute(dto: SwapSubscriptionPlanDto): Promise<void> {
        const newPlanId: PlanId = new PlanId(dto.newPlanId);
        const newPlanVariantId: PlanVariantId = new PlanVariantId(dto.newPlanVariantId);
        const subscriptionId: SubscriptionId = new SubscriptionId(dto.subscriptionId);
        const subscription: Subscription | undefined = await this.subscriptionRepository.findById(subscriptionId);
        if (!!!subscription) throw new Error("La subscripción ingresada no existe");

        const newPlan: Plan | undefined = await this.planRepository.findById(newPlanId, Locale.es);
        if (!!!newPlan) throw new Error("El nuevo plan al que te quieres suscribir no existe");

        const orders: Order[] = await this.orderRepository.findNextTwelveBySubscription(subscriptionId);

        subscription.swapPlan(orders, newPlan, newPlanVariantId);

        await this.orderRepository.saveSwappedPlanOrders(orders, newPlan, newPlanVariantId); // TO DO: Transaction / Queue
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

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
