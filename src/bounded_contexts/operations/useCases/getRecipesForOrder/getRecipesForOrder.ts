import { Order } from "../../domain/order/Order";
import { OrderId } from "../../domain/order/OrderId";
import { Recipe } from "../../domain/recipe/Recipe";
import { Subscription } from "../../domain/subscription/Subscription";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { GetRecipesForOrderDto } from "./getRecipesForOrderDto";

export class GetRecipesForOrder {
    private _orderRepository: IOrderRepository;
    private _recipeRepository: IRecipeRepository;
    private _subscriptionRepository: ISubscriptionRepository;

    constructor(orderRepository: IOrderRepository, recipeRepository: IRecipeRepository, subscriptionRepository: ISubscriptionRepository) {
        this._orderRepository = orderRepository;
        this._recipeRepository = recipeRepository;
        this._subscriptionRepository = subscriptionRepository;
    }
    public async execute(dto: GetRecipesForOrderDto): Promise<{ recipes: Recipe[]; order: Order; subscription: Subscription }> {
        const orderId: OrderId = new OrderId(dto.orderId);
        const order: Order = await this.orderRepository.findByIdOrThrow(orderId);
        const subscription: Subscription = await this.subscriptionRepository.findByIdOrThrow(order.subscriptionId);
        const recipes: Recipe[] = await this.recipeRepository.findForOrder(order, subscription.restriction?.id);

        return { recipes, order, subscription };
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter recipeRepository
     * @return {IRecipeRepository}
     */
    public get recipeRepository(): IRecipeRepository {
        return this._recipeRepository;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }
}
