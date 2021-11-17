import { CustomerId } from "../../domain/customer/CustomerId";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { OrderId } from "../../domain/order/OrderId";
import { RecipeSelection } from "../../domain/order/RecipeSelection";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Recipe } from "../../domain/recipe/Recipe";
import { RecipeVariantId } from "../../domain/recipe/RecipeVariant/RecipeVariantId";
import { RecipeVariantSku } from "../../domain/recipe/RecipeVariant/RecipeVariantSku";
import { Subscription } from "../../domain/subscription/Subscription";
import { SubscriptionId } from "../../domain/subscription/SubscriptionId";
import { IOrderRepository } from "../../infra/repositories/order/IOrderRepository";
import { IPaymentOrderRepository } from "../../infra/repositories/paymentOrder/IPaymentOrderRepository";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { ChooseRecipesForManyOrdersDto } from "./chooseRecipesForManyOrdersDto";

export class ChooseRecipesForManyOrders {
    private _orderRepository: IOrderRepository;
    private _recipeRepository: IRecipeRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _paymentOrderRepository: IPaymentOrderRepository;

    constructor(
        orderRepository: IOrderRepository,
        recipeRepository: IRecipeRepository,
        subscriptionRepository: ISubscriptionRepository,
        paymentOrderRepository: IPaymentOrderRepository
    ) {
        this._orderRepository = orderRepository;
        this._recipeRepository = recipeRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._paymentOrderRepository = paymentOrderRepository;
    }

    public async execute(
        dto: ChooseRecipesForManyOrdersDto
    ): Promise<{ inconsistentCustomerEmails: string[]; notOwnerOfOrderCustomerEmails: string[] }> {
        const orderIds: OrderId[] = [];
        const recipeVariantSkus: RecipeVariantSku[] = [];
        const orderIdRecipeSelectionMap: {
            [orderId: string]: { quantity: number; recipeVariantSku: RecipeVariantSku; isAdminChoosing: boolean; customerEmail: string }[];
        } = {};

        for (let selection of dto.selection) {
            const orderId: OrderId = new OrderId(selection.orderId);
            orderIds.push(orderId);

            for (let recipeSelection of selection.recipeSelection) {
                recipeVariantSkus.push(new RecipeVariantSku(recipeSelection.recipeVariantSku));
            }

            orderIdRecipeSelectionMap[orderId.value] = selection.recipeSelection.map((recipeSelection) => ({
                quantity: recipeSelection.quantity,
                recipeVariantSku: new RecipeVariantSku(recipeSelection.recipeVariantSku),
                isAdminChoosing: true,
                customerEmail: recipeSelection.customerEmail,
            }));
        }

        const orders: Order[] = await this.orderRepository.findByIdList(orderIds, Locale.es);
        const paymentOrders: PaymentOrder[] = await this.paymentOrderRepository.findByIdList(orders.map((order) => order.paymentOrderId!));
        const subscriptions: Subscription[] = await this.subscriptionRepository.findByIdList(orders.map((order) => order.subscriptionId));
        const recipes: Recipe[] = await this.recipeRepository.findByRecipeVariantSkuList(recipeVariantSkus);
        const recipeVariantSkuRecipeMap: { [recipeVariantSku: string]: { recipe: Recipe; recipeVariantId: RecipeVariantId } } = {};
        const subscriptionMap: { [subscriptionId: string]: Subscription } = {};
        const paymentOrderMap: { [paymentOrderId: string]: PaymentOrder } = {};

        for (let paymentOrder of paymentOrders) {
            paymentOrderMap[paymentOrder.id.value] = paymentOrder;
        }

        for (let recipe of recipes) {
            for (let variant of recipe.recipeVariants) {
                recipeVariantSkuRecipeMap[variant.sku.code] = { recipe, recipeVariantId: variant.id };
            }
        }

        for (let subscription of subscriptions) {
            subscriptionMap[subscription.id.value] = subscription;
        }

        const inconsistentCustomerEmails: string[] = [];
        const notOwnerOfOrderCustomerEmails: string[] = [];

        for (let order of orders) {
            const orderSelection = orderIdRecipeSelectionMap[order.id.value];

            if (orderSelection.some((selection) => selection.customerEmail !== orderSelection[0].customerEmail)) {
                inconsistentCustomerEmails.push(orderSelection[0].customerEmail);
                continue;
            }

            if (orderSelection.some((selection) => order.customer.email !== selection.customerEmail)) {
                notOwnerOfOrderCustomerEmails.push(
                    orderSelection.find((selection) => selection.customerEmail !== order.customer.email)!.customerEmail
                );
                continue;
            }

            const recipeSelections: RecipeSelection[] = orderSelection.map(
                (selection) =>
                    new RecipeSelection(
                        recipeVariantSkuRecipeMap[selection.recipeVariantSku.code].recipe,
                        selection.quantity,
                        recipeVariantSkuRecipeMap[selection.recipeVariantSku.code].recipeVariantId
                    )
            );
            order.updateRecipes(recipeSelections, true, subscriptionMap[order.subscriptionId.value].restriction);
            paymentOrderMap[order.paymentOrderId?.value!].lastRecipeSelectionDate = new Date();
        }

        await this.orderRepository.updateMany(orders);
        await this.paymentOrderRepository.updateMany(paymentOrders);

        return { inconsistentCustomerEmails, notOwnerOfOrderCustomerEmails };
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
     * Getter paymentOrderRepository
     * @return {IPaymentOrderRepository}
     */
    public get paymentOrderRepository(): IPaymentOrderRepository {
        return this._paymentOrderRepository;
    }
}
