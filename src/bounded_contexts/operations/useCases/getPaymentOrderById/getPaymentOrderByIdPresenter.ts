import Big from "big.js";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Customer } from "../../domain/customer/Customer";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { RecipeSelection } from "../../domain/order/RecipeSelection";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Subscription } from "../../domain/subscription/Subscription";

type PresentedOrder = {
    id: string;
    number: number;
    shippingDate: string;
    state: string;
    hasRecipes: boolean;
    recipes: any[];
    planIcon: string;
    planName: string;
    planVariant: string;
    amount: number;
};

export type GetPaymentOrderByIdHttpResponse = {
    id: string;
    amount: number;
    billingDate: string;
    discountAmount: number;
    couponCodes: (string | undefined)[];
    shippingCost: number;
    customer: string;
    customerName: string;
    state: string;
    orders: PresentedOrder[];
    totalAmount: number;
    subtotal: number;
    taxes: number;
    paymentIntentId: string;
    quantityRefunded: number;
    humanId: string | undefined;
}
export class GetPaymentOrderByIdPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(
        paymentOrder: PaymentOrder,
        orders: Order[],
        customer: Customer,
        subscriptions: Subscription[],
        locale: Locale
    ): Promise<GetPaymentOrderByIdHttpResponse> {
        const presentedOrders = await this.presentOrders(orders, locale);

        return {
            id: paymentOrder.id.toString(),
            amount: paymentOrder.amount,
            billingDate: paymentOrder.getHumanBillingDate(locale),
            discountAmount: paymentOrder.getDiscountAmountOrShippingCostIfHasFreeShipping(),
            couponCodes: subscriptions.map((subscription) => subscription.coupon?.couponCode),
            shippingCost: paymentOrder.shippingCost,
            customer: paymentOrder.customerId.toString(),
            customerName: customer.getPersonalInfo().fullName!,
            state: paymentOrder.state.title,
            orders: presentedOrders,
            totalAmount: paymentOrder.getFinalAmount(),
            subtotal: paymentOrder.amount,
            taxes: paymentOrder.shippingCost * 0.21 + paymentOrder.getPlansAmountMinusDiscount() * 0.1,
            // taxes: parseFloat((paymentOrder.shippingCost * 0.21 + paymentOrder.getPlansAmountMinusDiscount() * 0.1).toFixed(2)),
            paymentIntentId: paymentOrder.paymentIntentId,
            quantityRefunded: paymentOrder.quantityRefunded,
            humanId: paymentOrder.getHumanIdOrIdValue(),

        };
    }

    public async presentOrders(orders: Order[], locale: Locale): Promise<any> {
        const presentedOrders = [];

        for (let order of orders) {
            const planIcon = await this.storageService.getPresignedUrlForFile(order.plan.iconLinealColorUrl);
            const presentedRecipes = await this.presentRecipeSelection(order.recipeSelection);

            presentedOrders.push({
                id: order.id.value,
                number: order.counter,
                shippingDate: order.getHumanShippmentDay(locale),
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
