import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { v4 as uuid } from "uuid";
import { IStorageService } from "../../application/storageService/IStorageService";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Week } from "../../domain/week/Week";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { Locale } from "../../domain/locale/Locale";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";

export class GetSubscriptionByIdPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(subscription: Subscription, orders: Order[], customer: Customer, paymentOrders: PaymentOrder[]): Promise<any> {
        const presentedPlan = await this.presentPlan(subscription);

        const shippingAddress = {
            addressName: customer.shippingAddress?.name,
            addressDetails: customer.shippingAddress?.details,
            preferredSchedule: customer.shippingAddress?.deliveryTime?.getLabel(Locale.es) || "Sin seleccionar",
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
        const actualWeekOrder = nextActiveOrder && nextActiveOrder.isGoingToBeShippedThisWeek() ? nextActiveOrder : null;
        const nextWeekOrder =
            nextActiveOrder && nextActiveOrder.isGoingToBeShippedNextWeek()
                ? nextActiveOrder
                : nextSecondActiveOrder && nextSecondActiveOrder.isGoingToBeShippedNextWeek()
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
        const nextPaymentOrderWithShippingCost: PaymentOrder | undefined = !!actualWeekOrder
            ? paymentOrders.find(
                  (po) =>
                      po.week.equals(actualWeekOrder.week) &&
                      !po.hasFreeShipping &&
                      po.shippingCost > 0 &&
                      po.customerId.equals(actualWeekOrder.customer.id)
              )
            : !!nextWeekOrder
            ? paymentOrders.find(
                  (po) =>
                      po.week.equals(nextWeekOrder.week) &&
                      !po.hasFreeShipping &&
                      po.shippingCost > 0 &&
                      po.customerId.equals(nextWeekOrder.customer.id)
              )
            : undefined;

        return {
            subscriptionId: subscription.id.value,
            plan: presentedPlan,
            actualPlanVariant: this.presentPlanVariant(
                subscription.plan.planVariants.find((variant) => subscription.planVariantId.equals(variant.id))!
            ),
            shippingAddress,
            // billingData,
            paymentMethod: presentedPaymentMethod,
            schedule,
            hasChosenRecipesForActualWeek,
            hasChosenRecipesForNextWeek,
            actualWeekOrder: actualWeekOrder ? await this.presentWeekRecipes(actualWeekOrder) : null,
            nextWeekOrder: nextWeekOrder ? await this.presentWeekRecipes(nextWeekOrder) : null,
            canChooseRecipesForNextWeekOrder: nextWeekOrder && nextWeekOrder.isInTimeToChooseRecipes() && canChooseRecipes,
            skippedOrders,
            canChooseRecipes,
            nextTwelveOrders,
            hasRecipes: subscription.plan.hasRecipes,
            shippingCost: !!nextPaymentOrderWithShippingCost ? nextPaymentOrderWithShippingCost.shippingCost : 0,
        };
    }

    private async presentPlan(subscription: Subscription): Promise<any> {
        return {
            id: subscription.plan.id.value,
            planName: subscription.plan.name,
            planVariantDescription: subscription.getPlanVariantLabel(),
            variants: subscription.plan.planVariants
                .filter((variant) => !variant.isDeleted)
                .map((variant) => this.presentPlanVariant(variant)),
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

    private presentPlanVariant(variant: PlanVariant): any {
        return {
            id: variant.id.value,
            isDefault: variant.isDefault,
            description: variant.getLabelWithPrice(),
            price: variant.getPaymentPrice(),
            //@ts-ignore
            numberOfPersons: variant.numberOfPersons || 0,
            //@ts-ignore
            numberOfRecipes: variant.numberOfRecipes || 0,
        };
    }

    private presentOrders(orders: Order[]): any {
        return orders.map((order) => ({
            id: order.id.value,
            weekLabel: order.getWeekLabel(),
            shippingDate: order.getHumanShippmentDay(),
            isSkipped: order.isSkipped(),
            state: order.state.title,
        }));
    }

    private async presentWeekRecipes(order: Order | undefined): Promise<any> {
        if (!!!order) return [];
        const presentedRecipes = [];

        for (let selection of order.recipeSelection) {
            const recipeUrl = selection.recipe.getMainImageUrl()
                ? await this.storageService.getPresignedUrlForFile(selection.recipe.getMainImageUrl())
                : "";

            const recipeImages: string[] = [];

            for (let imageUrl of selection.recipe.getImagesUrls()) {
                const presignedUrl = await this.storageService.getPresignedUrlForFile(imageUrl);
                recipeImages.push(presignedUrl);
            }
            presentedRecipes.push({
                id: selection.recipe.id.value,
                name: selection.recipe.recipeGeneralData.name,
                imageUrl: recipeUrl,
                imagesUrls: recipeImages,
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
                nutritionalInfo: selection.recipe.recipeNutritionalData.nutritionalItems.map((item) => ({
                    key: item.key,
                    value: item.value,
                })),
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
