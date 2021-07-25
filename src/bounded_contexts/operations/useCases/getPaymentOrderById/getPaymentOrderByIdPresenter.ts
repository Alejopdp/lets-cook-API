import { IStorageService } from "../../application/storageService/IStorageService";
import { Order } from "../../domain/order/Order";
import { RecipeSelection } from "../../domain/order/RecipeSelection";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";

export class GetPaymentOrderByIdPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(paymentOrder: PaymentOrder, orders: Order[]): Promise<any> {
        const presentedOrders = await this.presentOrders(orders);

        return {
            id: paymentOrder.id.value,
            amount: paymentOrder.amount,
            billingDate: paymentOrder.getHumanBillingDate(),
            discountAmount: paymentOrder.discountAmount,
            shippingCost: paymentOrder.shippingCost,
            customer: paymentOrder.customerId.value,
            state: paymentOrder.state.humanTitle,
            orders: presentedOrders,
            totalAmount: paymentOrder.getTotalAmount(),
        };
    }

    public async presentOrders(orders: Order[]): Promise<any> {
        const presentedOrders = [];

        for (let order of orders) {
            const planIcon = await this.storageService.getPresignedUrlForFile(order.plan.iconLinealColorUrl);
            const presentedRecipes = await this.presentRecipeSelection(order.recipeSelection);

            presentedOrders.push({
                id: order.id.value,
                shippingDate: order.getHumanShippmentDay(),
                state: order.state.humanTitle,
                hasRecipes: order.hasChosenRecipes(),
                recipes: presentedRecipes,
                planIcon,
                planName: order.getPlanName(),
                planVariant: order.getPlanVariantLabel(order.planVariantId),
            });
        }

        return presentedOrders;
    }

    public async presentRecipeSelection(recipeSelection: RecipeSelection[]): Promise<any> {
        const presentedSelection = [];

        for (let selection of recipeSelection) {
            const imageUrl = await this.storageService.getPresignedUrlForFile(selection.recipe.getMainImageUrl());

            presentedSelection.push({
                id: selection.recipe.id.value,
                name: selection.recipe.getName(),
                variantSku: selection.recipe.getVariantSkuByVariantsIds([selection.recipeVariantId]),
                imageUrl,
                quantity: selection.quantity,
            });
        }

        return presentedSelection;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
