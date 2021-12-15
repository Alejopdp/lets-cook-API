import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { OrderId } from "../../domain/order/OrderId";
import { RecipeSelection } from "../../domain/order/RecipeSelection";
import { Recipe } from "../../domain/recipe/Recipe";
import { RecipeId } from "../../domain/recipe/RecipeId";
import { RecipeVariantId } from "../../domain/recipe/RecipeVariant/RecipeVariantId";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { ChooseRecipesForOrderDto } from "./chooseRecipesForOrderDto";

export class ChooseRecipesForOrder {
    private _orderRepository: IOrderRepository;
    private _recipeRepository: IRecipeRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _logRepository: ILogRepository;

    constructor(
        orderRepository: IOrderRepository,
        recipeRepository: IRecipeRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        logRepository: ILogRepository
    ) {
        this._orderRepository = orderRepository;
        this._recipeRepository = recipeRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._logRepository = logRepository;
    }

    public async execute(dto: ChooseRecipesForOrderDto): Promise<any> {
        const orderId: OrderId = new OrderId(dto.orderId);
        const recipesIds: RecipeId[] = dto.recipeSelection.map((selection) => new RecipeId(selection.recipeId));
        const order: Order = await this.orderRepository.findByIdOrThrow(orderId, Locale.es);
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
        this.logRepository.save(
            new Log(
                LogType.RECIPES_CHOSEN,
                dto.isAdminChoosing ? "Admin" : order.customer.getFullNameOrEmail(),
                dto.isAdminChoosing ? "Admin" : "Usuario",
                `Se han elegido recetas`,
                `Se han elegido recetas para la orden ${order.id.toString()}`,
                new Date(),
                order.customer.id
            )
        );
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

    /**
     * Getter logRepository
     * @return {ILogRepository}
     */
    public get logRepository(): ILogRepository {
        return this._logRepository;
    }
}
