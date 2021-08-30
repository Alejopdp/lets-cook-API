import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { v4 as uuid } from "uuid";
import { IStorageService } from "../../application/storageService/IStorageService";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Week } from "../../domain/week/Week";
import { PlanId } from "../../domain/plan/PlanId";

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
            addressName: customer.billingAddress?.customerName,
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

        const nextActiveOrder: Order | undefined = subscription.getNextOrderToShip(orders);
        const nextSecondActiveOrder: Order | undefined = subscription.getNextSecondOrderToShip(orders);
        const actualWeekOrder = nextActiveOrder && nextActiveOrder.isActualWeek() ? nextActiveOrder : null;
        const nextWeekOrder =
            nextActiveOrder && nextActiveOrder.isNextWeek()
                ? nextActiveOrder
                : nextSecondActiveOrder && nextSecondActiveOrder.isNextWeek()
                ? nextSecondActiveOrder
                : null; // TO DO: Get 2nd Next Active order
        const hasChosenRecipesForActualWeek = !!!actualWeekOrder ? false : actualWeekOrder.hasChosenRecipes();
        const hasChosenRecipesForNextWeek = !!!nextWeekOrder ? false : nextWeekOrder.hasChosenRecipes();

        const schedule = {
            nextDelivery: !!!nextActiveOrder ? "" : nextActiveOrder.getHumanShippmentDay(),
            nextPayment: !!!nextSecondActiveOrder ? "" : nextSecondActiveOrder.getHumanBillingDay(),
        };

        const skippedOrders = this.presentOrders(orders.filter((order) => order.isSkipped()));

        const canChooseRecipes = subscription.plan.abilityToChooseRecipes;
        const nextTwelveOrders = this.presentOrders(orders);

        console.log("ACTUAL WEEK ORDER; ", actualWeekOrder);
        return {
            subscriptionId: subscription.id.value,
            plan: presentedPlan,
            shippingAddress,
            // billingData,
            paymentMethod: presentedPaymentMethod,
            schedule,
            hasChosenRecipesForActualWeek,
            hasChosenRecipesForNextWeek,
            actualWeekOrder: actualWeekOrder ? await this.presentWeekRecipes(actualWeekOrder) : null,
            nextWeekOrder: nextWeekOrder ? await this.presentWeekRecipes(nextWeekOrder) : null,
            canChooseRecipesForNextWeekOrder: nextWeekOrder && nextWeekOrder.isInTimeToChooseRecipes(),
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

        for (let selection of order.recipeSelection) {
            presentedRecipes.push({
                id: selection.recipe.id.value,
                name: selection.recipe.recipeGeneralData.name,
                imageUrl: await this.storageService.getPresignedUrlForFile(selection.recipe.recipeGeneralData.imageUrl),
                images: [],
                sku: selection.recipe.recipeGeneralData.recipeSku.code,
                shortDescription: selection.recipe.recipeGeneralData.recipeDescription.shortDescription,
                longDescription: selection.recipe.recipeGeneralData.recipeDescription.longDescription,
                cookDuration: selection.recipe.recipeGeneralData.cookDuration.value(),
                cookDurationNumberValue: selection.recipe.recipeGeneralData.cookDuration.timeValue,
                difficultyLevel: selection.recipe.recipeGeneralData.difficultyLevel,
                weight: selection.recipe.recipeGeneralData.recipeWeight.value(),
                weightNumberValue: selection.recipe.recipeGeneralData.recipeWeight.weightValue,
                backOfficeTags: selection.recipe.recipeBackOfficeTags.map((tag) => tag.name),
                imageTags: selection.recipe.recipeImageTags.map((tag) => tag.name),
                availableWeeks: selection.recipe.availableWeeks.map((week: Week) => {
                    return {
                        id: week.id.value,
                        label: `${MomentTimeService.getNumberOfDayInMonth(week.minDay)}-${MomentTimeService.getNumberOfDayInMonth(
                            week.maxDay
                        )} ${MomentTimeService.getShortenedMonthName(week.minDay)}`,
                    };
                }),

                availableMonths: selection.recipe.availableMonths,
                relatedPlans: selection.recipe.relatedPlans.map((planId: PlanId) => planId.value),
                tools: selection.recipe.recipeTools,
                recipeVariants: selection.recipe.recipeVariants.map((variant) => {
                    return {
                        ingredients: variant.ingredients.map((ing) => ing.name),
                        restriction: {
                            id: variant.restriction.id.value,
                            value: variant.restriction.value,
                            label: variant.restriction.label,
                        },
                        sku: variant.sku.code,
                    };
                }),
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
