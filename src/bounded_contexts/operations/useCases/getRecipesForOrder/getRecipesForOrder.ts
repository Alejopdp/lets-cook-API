import { Order } from "../../domain/order/Order";
import { OrderId } from "../../domain/order/OrderId";
import { Recipe } from "../../domain/recipe/Recipe";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";
import { Subscription } from "../../domain/subscription/Subscription";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { GetRecipesForOrderDto } from "./getRecipesForOrderDto";
import { performance } from "perf_hooks";

export class GetRecipesForOrder {
    private _orderRepository: IOrderRepository;
    private _recipeRepository: IRecipeRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _recipeRatingRepository: IRateRepository

    constructor(orderRepository: IOrderRepository, recipeRepository: IRecipeRepository, subscriptionRepository: ISubscriptionRepository, recipeRatingRepository: IRateRepository) {
        this._orderRepository = orderRepository;
        this._recipeRepository = recipeRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._recipeRatingRepository = recipeRatingRepository;
    }
    public async execute(dto: GetRecipesForOrderDto): Promise<{ recipes: Recipe[]; order: Order; subscription: Subscription, recipeRatings: RecipeRating[], averageRecipeRatingsMap: Map<string, number> }> {
        const orderId: OrderId = new OrderId(dto.orderId);
        const order: Order = await this.orderRepository.findByIdOrThrow(orderId, dto.locale);
        const subscription: Subscription = await this.subscriptionRepository.findByIdOrThrow(order.subscriptionId, dto.locale);
        const recipes: Recipe[] = await this.recipeRepository.findForOrder(order, subscription.restriction?.id, dto.locale);
        const customerRecipesRatings = await this.recipeRatingRepository.findAllByCustomer(order.customer.id, dto.locale);
        const start = performance.now();

        const ratingPromises = recipes.map((recipe) =>
            this.recipeRatingRepository.findAverageRatingByRecipe(recipe.id)
                .then((rating) => ({ id: recipe.id.toString(), rating }))
        );

        const ratings = await Promise.all(ratingPromises);
        const averageRecipeRatingsMap = new Map<string, number>(ratings.map(({ id, rating }) => [id, rating]));
        const end = performance.now();
        console.log(`Tiempo de ejecución: ${(end - start) / 1000} s`);
        recipes.forEach(
            (recipe) =>
            (recipe.recipeVariants = recipe.recipeVariants.filter((variant) =>
                subscription.restriction
                    ? variant.restriction.equals(subscription.restriction)
                    : variant.restriction.value === "apto_todo"
            ))
        );

        return { recipes, order, subscription, recipeRatings: customerRecipesRatings, averageRecipeRatingsMap };
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

    /**
     * Getter recipeRatingRepository
     * @return {IRateRepository}
     */
    public get recipeRatingRepository(): IRateRepository {
        return this._recipeRatingRepository;
    }

}
