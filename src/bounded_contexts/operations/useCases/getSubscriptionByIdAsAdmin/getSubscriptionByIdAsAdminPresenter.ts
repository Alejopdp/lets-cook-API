import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { v4 as uuid } from "uuid";
import { IStorageService } from "../../application/storageService/IStorageService";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { PaymentOrder } from "../../domain/paymentOrder/PaymentOrder";
import { Locale } from "../../domain/locale/Locale";

export class GetSubscriptionByIdAsAdminPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(
        subscription: Subscription,
        orders: Order[],
        customer: Customer,
        locale: Locale,
        nextPaymentOrder?: PaymentOrder
    ): Promise<any> {
        const presentedPlan = await this.presentPlan(subscription, locale);

        const defaultPaymentMethod: PaymentMethod | undefined = customer.getDefaultPaymentMethod();
        var presentedPaymentMethod = null;

        if (!!defaultPaymentMethod) {
            presentedPaymentMethod = {
                id: defaultPaymentMethod.id.value,
                cardLabel: customer.getDefaultPaymentMethodCardLabel(Locale.es),
                expirationDateLabel: customer.getDefaultPaymentMethodExpirationDateLabel(Locale.es),
                default: true,
            };
        }

        const nextActiveOrder: Order | undefined = subscription.getNextActiveOrder(orders);
        const nextSecondActiveOrder: Order | undefined = subscription.getNextSecondActiveOrder(orders);
        const hasChosenRecipesForActualWeek = !!!nextActiveOrder ? false : nextActiveOrder.hasChosenRecipes();
        const hasChosenRecipesForNextWeek = !!!nextSecondActiveOrder ? false : nextSecondActiveOrder.hasChosenRecipes();
        const actualWeekOrder = await this.presentWeekRecipes(locale, nextActiveOrder);
        const nextWeekOrder = await this.presentWeekRecipes(locale, nextSecondActiveOrder); // TO DO: Get 2nd Next Active order

        const schedule = {
            nextDelivery: !!!nextActiveOrder ? "" : nextActiveOrder.getHumanShippmentDay(locale),
            nextPayment: !!!nextSecondActiveOrder ? "" : nextSecondActiveOrder.getHumanBillingDay(locale),
        };

        const skippedOrders = this.presentOrders(
            orders.filter((order) => order.isSkipped()),
            locale
        );

        const canChooseRecipes = subscription.plan.abilityToChooseRecipes;
        const nextTwelveOrders = this.presentOrders(orders, locale);

        return {
            subscriptionId: subscription.id.value,
            restriction: {
                text: subscription.restriction?.label,
                value: subscription.restriction?.id.value,
                id: subscription.restriction?.id.value,
            },
            state: subscription.state.title,
            customerName: customer.getPersonalInfo().fullName || customer.email,
            customerId: customer.id.value,
            restrictionComment: subscription.restrictionComment,
            coupon: {
                id: subscription.coupon?.id.value,
                code: subscription.coupon?.couponCode,
            },
            amountDetails: {
                subtotal: nextActiveOrder?.price,
                shippingCost: nextPaymentOrder?.shippingCost,
                discount: subscription.getCouponDiscountOr0IfIsNotApplyable(nextPaymentOrder?.shippingCost || 0),
                taxes:
                    (Math.round(
                        (Math.round((nextActiveOrder?.price || 0) * 100) - Math.round((nextActiveOrder?.discountAmount || 0) * 100)) * 0.1
                    ) +
                        Math.round((nextPaymentOrder?.shippingCost || 0) * 0.21 * 100)) /
                    100,
                total:
                    (nextActiveOrder?.getTotalPrice() || subscription.getPrice()) +
                    (nextPaymentOrder?.shippingCost || 0) -
                    subscription.getCouponDiscountOr0IfIsNotApplyable(nextPaymentOrder?.shippingCost || 0),
            },
            frequency: subscription.frequency.value(),
            plan: presentedPlan,
            shippingAddress: customer.getShippingAddress().addressName,
            // billingData,
            paymentMethod: presentedPaymentMethod?.id === "wallet" ? "Monedero" : presentedPaymentMethod?.cardLabel,
            schedule,
            nextBillingDate: nextActiveOrder?.getDdMmYyyyBillingDate(),
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

    private async presentPlan(subscription: Subscription, locale: Locale): Promise<any> {
        return {
            planName: subscription.plan.name,
            planVariantDescription: subscription.getPlanVariantLabel(Locale.es),
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

    private presentOrders(orders: Order[], locale: Locale): any {
        return orders.map((order) => ({
            id: order.id.value,
            weekLabel: order.getWeekLabel(locale),
            shippingDate: order.getHumanShippmentDay(locale),
            isSkipped: order.isSkipped(),
        }));
    }

    private async presentWeekRecipes(locale: Locale, order: Order | undefined): Promise<any> {
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
