import { Order } from "../../domain/order/Order";
import { OrderId } from "../../domain/order/OrderId";
import { RecipeSelection } from "../../domain/order/RecipeSelection";
import { Recipe } from "../../domain/recipe/Recipe";
import { RecipeId } from "../../domain/recipe/RecipeId";
import { RecipeVariantId } from "../../domain/recipe/RecipeVariant/RecipeVariantId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { ChooseRecipesForOrderDto } from "./chooseRecipesForOrderDto";

export class ChooseRecipesForOrder {
    private _orderRepository: IOrderRepository;
    private _recipeRepository: IRecipeRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;

    constructor(orderRepository: IOrderRepository, recipeRepository: IRecipeRepository, paymentOrderRepository: IPaymentOrderRepository) {
        this._orderRepository = orderRepository;
        this._recipeRepository = recipeRepository;
        this._paymentOrderRepository = paymentOrderRepository;
    }

    public async execute(dto: ChooseRecipesForOrderDto): Promise<any> {
        const orderId: OrderId = new OrderId(dto.orderId);
        const recipesIds: RecipeId[] = dto.recipeSelection.map((selection) => new RecipeId(selection.recipeId));
        const order: Order = await this.orderRepository.findByIdOrThrow(orderId);
        const paymentOrder = await this.paymentOrderRepository.findByIdOrThrow(order.paymentOrderId!);
        const recipes: Recipe[] = await this.recipeRepository.findByIdList(recipesIds);
        const newRecipeSelection: RecipeSelection[] = [];

        for (let selection of dto.recipeSelection) {
            const newSelection: RecipeSelection = new RecipeSelection(
                recipes.find((recipe) => recipe.id.equals(new RecipeId(selection.recipeId)))!, // TO DO: Optimize
                selection.quantity,
                new RecipeVariantId(selection.recipeVariantId)
            );
            newRecipeSelection.push(newSelection);
        }

        order.updateRecipes(newRecipeSelection, dto.isAdminChoosing);
        paymentOrder.lastRecipeSelectionDate = new Date();

        await this.orderRepository.save(order);
        await this.paymentOrderRepository.save(paymentOrder);
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
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }
}
