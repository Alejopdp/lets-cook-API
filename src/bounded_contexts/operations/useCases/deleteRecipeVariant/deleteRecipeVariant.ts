import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { DeleteRecipeVariantDto } from "./deleteRecipeVariantDto";
import { RecipeVariantId } from "../../domain/recipe/RecipeVariant/RecipeVariantId";
import { Recipe } from "../../domain/recipe/Recipe";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { Order } from "../../domain/order/Order";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { Subscription } from "../../domain/subscription/Subscription";
import { RecipeVariant } from "../../domain/recipe/RecipeVariant/RecipeVariant";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { Locale } from "../../domain/locale/Locale";
import { RecipeVariantSku } from "../../domain/recipe/RecipeVariant/RecipeVariantSku";

export class DeleteRecipeVariant {
    private _recipeRepository: IRecipeRepository;
    private _orderRepository: IOrderRepository;
    private _subscriptionRepository: ISubscriptionRepository;

    constructor(recipeRepository: IRecipeRepository, orderRepository: IOrderRepository, subscriptionRepository: ISubscriptionRepository) {
        this._recipeRepository = recipeRepository;
        this._orderRepository = orderRepository;
        this._subscriptionRepository = subscriptionRepository;
    }

    public async execute(dto: DeleteRecipeVariantDto): Promise<any> {
        const recipeVariantSku: RecipeVariantSku = new RecipeVariantSku(dto.recipeVariantSku);
        const recipe: Recipe = await this.recipeRepository.findByRecipeVariantSkuOrThrow(recipeVariantSku.code, dto.locale);
        const ordersWithRecipe: Order[] = await this.orderRepository.findByChosenRecipeAndFutureShippingDate(recipe.id.toString());
        const subscriptionsIds: SubscriptionId[] = ordersWithRecipe.map((order) => order.subscriptionId);
        const subscriptionsOfOrdersWithRecipe = await this.subscriptionRepository.findByIdList(subscriptionsIds);
        const recipeVariantToDeleteRestriction: RecipeVariantRestriction = recipe.getVariantRestrictionByVariantSku(recipeVariantSku)!;
        const subscriptionsWithSameRestrictionMap: { [subscriptionId: string]: Subscription } = {};
        const ordersToSave: Order[] = [];

        // TO DO: Push logic to domain

        console.log("Restriction of recipe variant: ", recipeVariantToDeleteRestriction.id);
        for (let subscription of subscriptionsOfOrdersWithRecipe) {
            console.log("Subscription restriction: ", subscription.restriction?.id.toString());
            if (!!subscription.restriction?.equals(recipeVariantToDeleteRestriction)) {
                subscriptionsWithSameRestrictionMap[subscription.id.value] = subscription;
            }
        }

        for (let order of ordersWithRecipe) {
            if (!!subscriptionsWithSameRestrictionMap[order.subscriptionId.toString()]) {
                order.recipeSelection = [];
                ordersToSave.push(order);
            }
        }

        recipe.deleteRecipeVariant(recipeVariantSku);

        await this.orderRepository.updateMany(ordersToSave);
        await this.recipeRepository.save(recipe, dto.locale);
    }

    /**
     * Getter recipeRepository
     * @return {IRecipeRepository}
     */
    public get recipeRepository(): IRecipeRepository {
        return this._recipeRepository;
    }

    /**
     * Getter orderRepository
     * @return {IOrderRepository}
     */
    public get orderRepository(): IOrderRepository {
        return this._orderRepository;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }
}
