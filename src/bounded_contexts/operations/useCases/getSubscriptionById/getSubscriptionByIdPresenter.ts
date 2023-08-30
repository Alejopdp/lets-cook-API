import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { IStorageService } from "../../application/storageService/IStorageService";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { Week } from "../../domain/week/Week";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { Locale } from "../../domain/locale/Locale";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";

type PresentedPlanVariant = {
    id: string;
    isDefault: boolean
    description: string;
    price: number
    numberOfPersons: string | number
    numberOfRecipes: string | number
}

type PresentedPlan = {
    id: string;
    planName: string;
    planVariantDescription: string;
    variants: PresentedPlanVariant[];
    state: {
        state: string;
        stateTitle: string
    },
    servingsLabel: string;
    price: number,
    priceLabel: string
    icon: string
}


type PresentedRecipe = {
    id: string;
    name: string;
    imageUrl: string;
    imagesUrls: string[],
    sku: string,
    shortDescription: string,
    longDescription: string,
    cookDuration: string,
    cookDurationNumberValue: number,
    difficultyLevel: string,
    weight: string,
    weightNumberValue: number,
    backOfficeTags: string[],
    imageTags: string[],
    availableWeeks: { id: string, label: string }[],
    nutritionalInfo: { key: string, value: string }[],
    availableMonths: string[],
    relatedPlans: string[],
    tools: string[],
    recipeVariants: { ingredients: string[], restriction: { id: string, value: string, label: string }, sku: string }
}

type PresentedOrder = {
    id: string,
    weekLabel: string,
    shippingDate: string,
    isSkipped: boolean,
    state: string,
    isReanudable: boolean,
}

export type GetSubscriptionByIdResponse = {
    subscriptionId: string
    plan: PresentedPlan,
    actualPlanVariant: PresentedPlanVariant,
    isOneTime: boolean
    shippingAddress: {
        addressName: string | undefined;
        addressDetails: string | undefined;
        preferredSchedule: string;
    },
    paymentMethod: {
        id: string;
        cardLabel: string;
        expirationDateLabel: string;
        default: boolean,
    } | null,
    schedule: {
        nextDelivery: string;
        nextPayment: string
    },
    hasChosenRecipesForActualWeek: boolean,
    hasChosenRecipesForNextWeek: boolean,
    actualWeekOrder: {
        id: string,
        weekLabel: string,
        weekId: string,
        recipes: PresentedRecipe[],
        shippingDate: string
    } | undefined,
    nextWeekOrder: {
        id: string,
        weekLabel: string,
        weekId: string,
        recipes: PresentedRecipe[],
        shippingDate: string
    } | undefined,
    canChooseRecipesForNextWeekOrder: boolean,
    skippedOrders: PresentedOrder[],
    canChooseRecipes: boolean,
    nextTwelveOrders: PresentedOrder[],
    hasRecipes: boolean,
    shippingCost: number,
    portionsQuantity: string | number,
    portionPrice: string | number,
}

export class GetSubscriptionByIdPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(
        subscription: Subscription,
        orders: Order[],
        customer: Customer,
        paymentOrders: PaymentOrder[],
        locale: Locale,
        queryDate: Date
    ): Promise<GetSubscriptionByIdResponse> {
        const presentedPlan = await this.presentPlan(subscription, locale);

        const shippingAddress = {
            addressName: customer.shippingAddress?.name,
            addressDetails: customer.shippingAddress?.details,
            preferredSchedule: customer.shippingAddress?.deliveryTime?.getLabel(Locale.es) || "",
        };

        const defaultPaymentMethod: PaymentMethod | undefined = customer.getDefaultPaymentMethod();
        var presentedPaymentMethod = null;

        if (!!defaultPaymentMethod) {
            presentedPaymentMethod = {
                id: defaultPaymentMethod.id.toString(),
                cardLabel: customer.getDefaultPaymentMethodCardLabel(locale),
                expirationDateLabel: customer.getDefaultPaymentMethodExpirationDateLabel(locale),
                default: true,
            };
        }

        const nextActiveOrder: Order | undefined = subscription.getNextOrderToShip(orders);
        const nextSecondActiveOrder: Order | undefined = subscription.getNextSecondOrderToShip(orders);
        const actualWeekOrder = nextActiveOrder && nextActiveOrder.isGoingToBeShippedThisWeek(queryDate) ? nextActiveOrder : null;
        const nextWeekOrder =
            nextActiveOrder && nextActiveOrder.isGoingToBeShippedNextWeek(queryDate)
                ? nextActiveOrder
                : nextSecondActiveOrder && nextSecondActiveOrder.isGoingToBeShippedNextWeek(queryDate)
                    ? nextSecondActiveOrder
                    : null; // TO DO: Get 2nd Next Active order
        const hasChosenRecipesForActualWeek = !!!actualWeekOrder ? false : actualWeekOrder.hasChosenRecipes();
        const hasChosenRecipesForNextWeek = !!!nextWeekOrder ? false : nextWeekOrder.hasChosenRecipes();

        const schedule = {
            nextDelivery: !!nextActiveOrder
                ? nextActiveOrder.getHumanShippmentDay(locale)
                : !!nextSecondActiveOrder
                    ? nextSecondActiveOrder.getHumanShippmentDay(locale)
                    : "",
            nextPayment:
                !!nextActiveOrder && nextActiveOrder.billingDate > queryDate
                    ? nextActiveOrder.getHumanBillingDay(locale)
                    : !!nextSecondActiveOrder
                        ? nextSecondActiveOrder.getHumanBillingDay(locale)
                        : "",
        };

        const skippedOrders = this.presentOrders(
            orders.filter((order) => order.isSkipped()),
            locale
        );

        const canChooseRecipes = subscription.plan.abilityToChooseRecipes;
        const nextTwelveOrders = this.presentOrders(orders, locale);
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
            subscriptionId: subscription.id.toString(),
            plan: presentedPlan,
            actualPlanVariant: this.presentPlanVariant(
                subscription.plan.getPlanVariantById(subscription.planVariantId)!,
                locale
            ),
            isOneTime: subscription.frequency.isOneTime(),
            shippingAddress,
            paymentMethod: presentedPaymentMethod,
            schedule,
            hasChosenRecipesForActualWeek,
            hasChosenRecipesForNextWeek,
            actualWeekOrder: actualWeekOrder ? await this.presentWeekRecipes(actualWeekOrder, locale) : null,
            nextWeekOrder: nextWeekOrder ? await this.presentWeekRecipes(nextWeekOrder, locale) : null,
            canChooseRecipesForNextWeekOrder: !!nextWeekOrder && nextWeekOrder.isInTimeToChooseRecipes(queryDate) && canChooseRecipes,
            skippedOrders,
            canChooseRecipes,
            nextTwelveOrders,
            hasRecipes: subscription.plan.hasRecipes,
            shippingCost: !!nextPaymentOrderWithShippingCost ? nextPaymentOrderWithShippingCost.shippingCost : 0,
            portionsQuantity: subscription.getPortionsQuantity(),
            portionPrice: subscription.getPortionPrice(),
        };
    }

    private async presentPlan(subscription: Subscription, locale: Locale): Promise<PresentedPlan> {
        return {
            id: subscription.plan.id.toString(),
            planName: subscription.plan.name,
            planVariantDescription: subscription.getPlanVariantLabel(locale),
            variants: subscription.plan.planVariants
                .filter((variant) => !variant.isDeleted)
                .map((variant) => this.presentPlanVariant(variant, locale)),
            state: {
                state: subscription.getStateHumanTitle(locale),
                stateTitle: subscription.state.title,
            },
            servingsLabel: subscription.getServingsLabel(),
            price: subscription.getPrice(),
            priceLabel: subscription.getPriceByFrequencyLabel(locale),
            icon: await this.storageService.getPresignedUrlForFile(subscription.plan.iconLinealColorUrl),
        };
    }

    private presentPlanVariant(variant: PlanVariant, locale: Locale): any {
        return {
            id: variant.id.value,
            isDefault: variant.isDefault,
            description: variant.getLabelWithPrice(locale),
            price: variant.getPaymentPrice(),
            //@ts-ignore
            numberOfPersons: variant.numberOfPersons || 0,
            //@ts-ignore
            numberOfRecipes: variant.numberOfRecipes || 0,
        };
    }

    private presentOrders(orders: Order[], locale: Locale): any {
        return orders.map((order) => ({
            id: order.id.value,
            weekLabel: order.getWeekLabel(locale),
            shippingDate: order.getHumanShippmentDay(locale),
            isSkipped: order.isSkipped(),
            state: order.state.title,
            isReanudable: order.isReanudable(),
        }));
    }

    private async presentWeekRecipes(order: Order | undefined, locale: Locale): Promise<any> {
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
            weekLabel: order.getWeekLabel(locale),
            weekId: order.week.id.value,
            recipes: presentedRecipes,
            shippingDate: order.getHumanShippmentDay(locale),
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
