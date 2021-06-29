import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { v4 as uuid } from "uuid";
import { IStorageService } from "../../application/storageService/IStorageService";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";

export class GetSubscriptionByIdPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(subscription: Subscription, orders: Order[], customer: Customer): Promise<any> {
        const presentedPlan = await this.presentPlan(subscription);

        const shippingAddress = {
            addressName: customer.shippingAddress?.name,
            addressDetails: customer.shippingAddress?.details,
            preferredSchedule: "Hardcoded",
        };

        const billingData = {
            addressName: customer.billingAddress?.name,
            addressDetails: customer.billingAddress?.details,
            name: "Alejo Scotti (Hardcoded)",
        };

        const defaultPaymentMethod: PaymentMethod | undefined = customer.getDefaultPaymentMethod();
        var presentedPaymentMethod = null;

        if (!!defaultPaymentMethod) {
            presentedPaymentMethod = {
                id: defaultPaymentMethod.id.value,
                cardLabel: customer.getDefaultPaymentMethodCardLabel(),
                expirationDateLabel: customer.getDefaultPaymentMethodExpirationDateLabel(),
                default: true,
            };
        }

        const nextActiveOrder: Order | undefined = subscription.getNextActiveOrder(orders);
        const nextSecondActiveOrder: Order | undefined = subscription.getNextSecondActiveOrder(orders);
        const hasChosenRecipesForActualWeek = !!!nextActiveOrder ? false : nextActiveOrder.recipes.length > 0 ? true : false;
        const hasChosenRecipesForNextWeek = !!!nextSecondActiveOrder ? false : nextSecondActiveOrder.recipes.length > 0 ? true : false; // TO DO: Get 2nd Next Active order
        const actualWeekOrder = await this.presentWeekRecipes(nextActiveOrder);
        const nextWeekOrder = await this.presentWeekRecipes(nextSecondActiveOrder); // TO DO: Get 2nd Next Active order

        const schedule = {
            nextDelivery: !!!nextActiveOrder ? "" : nextActiveOrder.getHumanShippmentDay(),
            nextPayment: !!!nextSecondActiveOrder ? "" : nextSecondActiveOrder.getHumanBillingDay(),
        };

        const skippedOrders = this.presentOrders(orders.filter((order) => order.isSkipped()));

        const canChooseRecipes = subscription.plan.abilityToChooseRecipes;
        const nextTwelveOrders = this.presentOrders(orders);

        return {
            plan: presentedPlan,
            shippingAddress,
            // billingData,
            paymentMethod: presentedPaymentMethod,
            schedule,
            hasChosenRecipesForActualWeek,
            hasChosenRecipesForNextWeek,
            actualWeekOrder,
            nextWeekOrder,
            skippedOrders,
            canChooseRecipes,
            nextTwelveOrders,
            hasRecipes: subscription.plan.hasRecipes,
        };
    }

    private async presentPlan(subscription: Subscription): Promise<any> {
        return {
            planName: subscription.plan.name,
            planVariantDescription: subscription.getPlanVariantLabel(),
            state: {
                state: subscription.state.humanTitle,
                stateTitle: subscription.state.title,
            },
            servingsLabel: subscription.getServingsLabel(),
            price: subscription.price,
            priceLabel: subscription.getPriceByFrequencyLabel(),
            icon: await this.storageService.getPresignedUrlForFile(subscription.plan.iconLinealColorUrl),
        };
    }

    private presentOrders(orders: Order[]): any {
        return orders.map((order) => ({
            id: order.id.value,
            weekLabel: order.getWeekLabel(),
            shippingDate: order.getHumanShippmentDay(),
            isSkipped: order.isSkipped(),
        }));
    }

    private async presentWeekRecipes(order: Order | undefined): Promise<any> {
        if (!!!order) return [];
        const presentedRecipes = [];

        for (let recipe of order.recipes) {
            presentedRecipes.push({
                id: recipe.id.value,
                name: recipe.recipeGeneralData.name,
                imageUrl: await this.storageService.getPresignedUrlForFile(recipe.recipeGeneralData.imageUrl), // TO DO: Presign
                images: [],
                // restrictions: recipe.getVariantRestrictions(
                //     order.recipesVariantsIds.filter((variantId) => recipe.recipeVariants.some((variant) => variant.id.equals(variantId)))[0]
                // ),
            });
        }

        return {
            id: order.id.value,
            weekLabel: order.getWeekLabel(),
            weekId: order.week.id.value,
            recipes: presentedRecipes,
            shippingDate: order.getHumanShippmentDay(),
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
