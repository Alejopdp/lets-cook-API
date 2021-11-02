import { IStorageService } from "../../application/storageService/IStorageService";
import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { RecipeSelection } from "../../domain/order/RecipeSelection";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Subscription } from "../../domain/subscription/Subscription";

export class GetPaymentOrderByIdPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(paymentOrder: PaymentOrder, orders: Order[], customer: Customer, subscriptions: Subscription[]): Promise<any> {
        const presentedOrders = await this.presentOrders(orders);

        return {
            id: paymentOrder.id.value,
            amount: paymentOrder.amount,
            billingDate: paymentOrder.getHumanBillingDate(),
            discountAmount: paymentOrder.getDiscountAmountOrShippingCostIfHasFreeShipping(),
            couponCodes: subscriptions.map((subscription) => subscription.coupon?.couponCode),
            shippingCost: paymentOrder.shippingCost,
            customer: paymentOrder.customerId.value,
            customerName: customer.getPersonalInfo().fullName,
            // state: paymentOrder.state.humanTitle,
            state: paymentOrder.state.title,
            orders: presentedOrders,
            totalAmount: paymentOrder.getFinalAmount(),
            subtotal: paymentOrder.amount,
            taxes: paymentOrder.shippingCost * 0.21 + paymentOrder.amount * 0.1,
            paymentIntentId: paymentOrder.paymentIntentId,
            quantityRefunded: paymentOrder.quantityRefunded,
        };
    }

    public async presentOrders(orders: Order[]): Promise<any> {
        const presentedOrders = [];

        for (let order of orders) {
            const planIcon = await this.storageService.getPresignedUrlForFile(order.plan.iconLinealColorUrl);
            const presentedRecipes = await this.presentRecipeSelection(order.recipeSelection);

            presentedOrders.push({
                id: order.id.value,
                number: order.counter,
                shippingDate: order.getHumanShippmentDay(),
                // state: order.state.humanTitle,
                state: order.state.title,
                hasRecipes: order.hasChosenRecipes(),
                recipes: presentedRecipes,
                planIcon,
                planName: order.getPlanName(),
                planVariant: order.getPlanVariantLabel(order.planVariantId),
                amount: order.getTotalPrice(),
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
