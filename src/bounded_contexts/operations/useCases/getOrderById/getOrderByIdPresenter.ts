import { IStorageService } from "../../application/storageService/IStorageService";
import { Customer } from "../../domain/customer/Customer";
import { Locale } from "../../domain/locale/Locale";
import { Order } from "../../domain/order/Order";
import { RecipeSelection } from "../../domain/order/RecipeSelection";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Subscription } from "../../domain/subscription/Subscription";

export class GetOrderByIdPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(
        paymentOrder: PaymentOrder,
        order: Order,
        customer: Customer,
        subscription: Subscription,
        locale: Locale
    ): Promise<any> {
        const planIcon = await this.storageService.getPresignedUrlForFile(order.plan.iconLinealColorUrl);
        const presentedRecipes = await this.presentRecipeSelection(order.recipeSelection);

        return {
            id: order.id.value,
            number: order.counter,
            shippingDate: order.getHumanShippmentDay(locale),
            billingDate: order.getHumanBillingDay(locale),
            state: order.state.title,
            isSkipped: order.isSkipped(),
            hasRecipes: order.hasChosenRecipes(),
            recipes: presentedRecipes,
            planName: order.getPlanName(),
            planVariant: order.getPlanVariantLabel(order.planVariantId),
            planIcon,
            paymentOrderId: paymentOrder.id.value,
            paymentOrderHumanId: paymentOrder.getHumanIdOrIdValue(),
            amount: order.getTotalPrice(),
            couponCode: order.discountAmount > 0 ? subscription.coupon?.couponCode : undefined,
            //@ts-ignore
            numberOfRecipes: order.plan.getPlanVariantById(order.planVariantId)?.numberOfRecipes || 0,
            customerName: customer.getPersonalInfo().fullName,
            subscription: {
                subscriptionId: subscription.id.value,
                planId: order.plan.id.value,
                planName: order.getPlanName(),
                planVariant: order.getPlanVariantLabel(order.planVariantId),
                amount: order.getTotalPrice(),
                frequency: subscription.frequency.value(),
                restrictionId: subscription.restriction?.id.value,
                restrictionLabel: subscription.restriction?.label,
            },
            weekLabel: order.getWeekLabel(locale),
            isFirstOrderOfSubscription: order.isFirstOrderOfSubscription,
        };
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
