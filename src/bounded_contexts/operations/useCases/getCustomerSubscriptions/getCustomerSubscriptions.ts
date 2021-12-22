import { CustomerId } from "../../domain/customer/CustomerId";
import { Order } from "../../domain/order/Order";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { GetCustomerSubscriptionsDto } from "./getCustomerSubscriptionsDto";

export class GetCustomerSubscriptions {
    private _subscriptionRepository: ISubscriptionRepository;
    private _orderRepository: IOrderRepository;
    private _recipeRatingRepository: IRateRepository;

    constructor(
        subscriptionRepository: ISubscriptionRepository,
        orderRepository: IOrderRepository,
        recipeRatingRepository: IRateRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._orderRepository = orderRepository;
        this._recipeRatingRepository = recipeRatingRepository;
    }

    public async execute(
        dto: GetCustomerSubscriptionsDto
    ): Promise<{ subscriptions: Subscription[]; nextOrders: Order[]; ratings: RecipeRating[] }> {
        const customerId: CustomerId = new CustomerId(dto.customerId);
        const subscriptions: Subscription[] = await this.subscriptionRepository.findByCustomerId(customerId, dto.locale);
        const subscriptionsIds: SubscriptionId[] = subscriptions.map((subscription) => subscription.id);
        const nextOrders: Order[] = await this.orderRepository.findNextTwelveBySubscriptionList(subscriptionsIds, dto.locale);
        const ratings: RecipeRating[] = await this.recipeRatingRepository.findAllByCustomer(customerId, dto.locale);

        return { subscriptions, nextOrders, ratings };
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
     * Getter recipeRatingRepository
     * @return {IRateRepository}
     */
    public get recipeRatingRepository(): IRateRepository {
        return this._recipeRatingRepository;
    }
}
