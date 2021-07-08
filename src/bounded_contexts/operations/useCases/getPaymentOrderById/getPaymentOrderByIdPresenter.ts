import { IStorageService } from "../../application/storageService/IStorageService";
import { Order } from "../../domain/order/Order";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";

export class GetPaymentOrderByIdPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public present(paymentOrder: PaymentOrder, orders: Order[]): any {
        return {
            id: paymentOrder.id.value,
            amount: paymentOrder.amount,
            billingDate: paymentOrder.getHumanBillingDate(),
            discountAmount: paymentOrder.discountAmount,
            shippingCost: paymentOrder.shippingCost,
            customer: paymentOrder.customerId.value,
            state: paymentOrder.state.humanTitle,
            orders: orders.map((order) => ({
                id: order.id.value,
                shippingDate: order.getHumanShippmentDay(),
                state: order.state.humanTitle,
                hasChosenRecipes: order.hasChosenRecipes(),
                recipes: order.recipes.map((recipe) => ({
                    id: recipe.id.value,
                    variantSku: recipe.getVariantSkuByVariantsIds(order.recipesVariantsIds),
                    imageUrl: recipe.getMainImageUrl(),
                })),
                plan: order.getPlanName(),
                planVariant: order.getPlanVariantLabel(order.planVariantId),
            })),
        };
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
