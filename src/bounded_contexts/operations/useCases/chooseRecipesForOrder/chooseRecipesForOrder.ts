import { Log } from "../../domain/customer/log/Log";
import { LogType } from "../../domain/customer/log/LogType";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { OrderId } from "../../domain/order/OrderId";
import { RecipeSelection } from "../../domain/order/RecipeSelection";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Rate } from "../../domain/rate/Rate";
import { Recipe } from "../../domain/recipe/Recipe";
import { RecipeId } from "../../domain/recipe/RecipeId";
import { RecipeVariantId } from "../../domain/recipe/RecipeVariant/RecipeVariantId";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";
import { ILogRepository } from "../../infra/repositories/log/ILogRepository";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { ChooseRecipesForOrderDto } from "./chooseRecipesForOrderDto";

export class ChooseRecipesForOrder {
    private _orderRepository: IOrderRepository;
    private _recipeRepository: IRecipeRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;
    private _logRepository: ILogRepository;
    private _recipeRateRepository: IRateRepository;

    constructor(
        orderRepository: IOrderRepository,
        recipeRepository: IRecipeRepository,
        paymentOrderRepository: IPaymentOrderRepository,
        logRepository: ILogRepository,
        recipeRateRepository: IRateRepository
    ) {
        this._orderRepository = orderRepository;
        this._recipeRepository = recipeRepository;
        this._paymentOrderRepository = paymentOrderRepository;
        this._logRepository = logRepository;
        this._recipeRateRepository = recipeRateRepository;
    }

    public async execute(dto: ChooseRecipesForOrderDto): Promise<any> {
        const orderId: OrderId = new OrderId(dto.orderId);
        const recipesIds: RecipeId[] = dto.recipeSelection.map((selection) => new RecipeId(selection.recipeId));
        const order: Order = await this.orderRepository.findByIdOrThrow(orderId, Locale.es);
        const [paymentOrder, recipes, recipesRates]: [PaymentOrder, Recipe[], RecipeRating[]] = await Promise.all([this.paymentOrderRepository.findByIdOrThrow(order.paymentOrderId!), await this.recipeRepository.findByIdList(recipesIds), await this.recipeRateRepository.findAllByCustomer(order.customer.id, Locale.es)])
        const newRecipeSelection: RecipeSelection[] = [];
        const recipeMap: { [recipeId: string]: Recipe } = {};
        const recipeRateMap: { [recipeId: string]: RecipeRating } = {};


        for (let recipe of recipes) {
            recipeMap[recipe.id.toString()] = recipe;
        }

        for (let rate of recipesRates) {
            recipeRateMap[rate.recipe.id.toString()] = rate;
        }

        for (let oldSelection of order.recipeSelection) {
            var recipeRating = recipeRateMap[oldSelection.recipe.id.toString()];

            recipeRating?.removeOneDelivery(order.shippingDate);
        }

        for (let selection of dto.recipeSelection) {
            const newSelection: RecipeSelection = new RecipeSelection(
                recipeMap[selection.recipeId],
                selection.quantity,
                new RecipeVariantId(selection.recipeVariantId)
            );

            var rating = recipeRateMap[selection.recipeId];

            if (!!!rating) {
                rating = new RecipeRating(recipeMap[selection.recipeId], order.customer.id, 0, order.shippingDate, order.shippingDate, []);
                recipesRates.push(rating);
            }

            rating.addOneDelivery(order.shippingDate, !!!rating ? order.shippingDate : undefined);
            newRecipeSelection.push(newSelection);
        }

        order.updateRecipes(newRecipeSelection, dto.isAdminChoosing, dto.choosingDate);
        paymentOrder.lastRecipeSelectionDate = new Date();

        await this.orderRepository.save(order);
        await this.paymentOrderRepository.save(paymentOrder);
        this.recipeRateRepository.updateMany(recipesRates);
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

    /**
     * Getter recipeRateRepository
     * @return {IRateRepository}
     */
    public get recipeRateRepository(): IRateRepository {
        return this._recipeRateRepository;
    }
}
