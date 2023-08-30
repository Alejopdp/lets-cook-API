import { Subscription } from "../../domain/subscription/Subscription";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";
import { Order } from "../../domain/order/Order";
import { IStorageService } from "../../application/storageService/IStorageService";
import _ from "lodash";
import { Locale } from "../../domain/locale/Locale";
import { Customer } from "../../domain/customer/Customer";

export class GetCustomerSubscriptionsPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(
        subscriptions: Subscription[],
        nextOrders: Order[],
        locale: Locale,
        ratings: RecipeRating[],
        customer: Customer,
        queryDate: Date
    ): Promise<any> {
        const presentedPrincipalSubscriptions = [];
        const presentedAdditionalSubscriptions = [];
        const presentedAdditionalSubscriptionsWithoutDeliveredDuplicates = [];
        const orderSubscriptionMap: { [key: string]: Order[] } = {};
        const cancelledSubscriptions: Subscription[] = [];
        const nonCancelledSubscriptions: Subscription[] = [];
        const planSubscriptionMap: { [planId: string]: Subscription } = {};
        const additionalSubscriptionPlanMap: { [planId: string]: any } = {};
        const oneTimeDeliveredSubscriptions: any = [];
        var pendingActions = [];

        for (let order of nextOrders) {
            orderSubscriptionMap[order.subscriptionId.value] = Array.isArray(orderSubscriptionMap[order.subscriptionId.value])
                ? [...orderSubscriptionMap[order.subscriptionId.value], order]
                : [order];
        }

        for (let subscription of subscriptions.sort((sub1, sub2) => (sub2.state.isActive() ? 1 : -1))) {
            const HAS_A_PENDING_SHIPMENT = !!subscription.getNextOrderToShip(orderSubscriptionMap[subscription.id.toString()]);
            if (subscription.isActive()) planSubscriptionMap[subscription.plan.id.toString()] = subscription;
            if (
                subscription.isCancelled() &&
                !cancelledSubscriptions.some((s) => s.plan.id.equals(subscription.plan.id)) &&
                !planSubscriptionMap[subscription.plan.id.toString()]
            ) {
                cancelledSubscriptions.push(subscription);
            }
            else if (!subscription.isCancelled() || (subscription.isCancelled() && HAS_A_PENDING_SHIPMENT)) {
                nonCancelledSubscriptions.push(subscription);
            }
        }

        const oneTimeDeliveredStateMap = {
            es: "Entregado",
            en: "Delivered",
            ca: "lliurat",
        };
        for (let subscription of [...nonCancelledSubscriptions, ...cancelledSubscriptions]) {
            const presentedSubscription = {
                id: subscription.id.toString(),
                planId: subscription.plan.id.toString(),
                planVariantPrice: subscription.getPrice(),
                planVariantId: subscription.planVariantId.value,
                planName: subscription.plan.name,
                planVariantLabel: subscription.getPlanVariantLabel(locale) || "",
                nextShippment: subscription.getNextShipmentLabel(orderSubscriptionMap[subscription.id.value], locale),
                frequency: subscription.frequency.value(),
                isOneTime: subscription.frequency.isOneTime(),
                stateTitle:
                    !!!orderSubscriptionMap[subscription.id.value] && subscription.frequency.isOneTime()
                        ? "SUBSCRIPTION_DELIVERED"
                        : subscription.state.title,
                stateHumanTitle:
                    !!!orderSubscriptionMap[subscription.id.value] && subscription.frequency.isOneTime()
                        ? oneTimeDeliveredStateMap[locale]
                        : subscription.getStateHumanTitle(locale),
                stateColor: subscription.state.color,
                iconUrl: await this.storageService.getPresignedUrlForFile(subscription.plan.iconLinealColorUrl),
            };
            if (subscription.plan.isPrincipal()) {
                presentedPrincipalSubscriptions.push(presentedSubscription);
            } else {
                presentedAdditionalSubscriptions.push(presentedSubscription);
            }

            // Removing duplicated plans for one_time additional plans

            const nextOrder = subscription.getNextChoosableRecipesOrder(orderSubscriptionMap[subscription.id.value], queryDate);

            if (
                !!nextOrder &&
                !nextOrder.hasChosenRecipes() &&
                nextOrder.plan.abilityToChooseRecipes &&
                (nextOrder.isActive() || nextOrder.isBilled()) &&
                subscription.isActive()
            ) {
                pendingActions.push({
                    type: "choose_recipes",
                    planName: nextOrder.plan.name,
                    shippment: nextOrder.getPendingRecipeChooseLabel(locale),
                    orderId: nextOrder.id.value,
                });
            }
        }

        for (let sub of presentedAdditionalSubscriptions.sort((sub1, sub2) => (sub1.stateTitle > sub2.stateTitle ? 1 : -1))) {
            if (sub.stateTitle === "SUBSCRIPTION_ACTIVE") additionalSubscriptionPlanMap[sub.planId] = sub;
            if (
                sub.stateTitle === "SUBSCRIPTION_DELIVERED" &&
                !oneTimeDeliveredSubscriptions.some((s: any) => s.planId === sub.planId) &&
                !additionalSubscriptionPlanMap[sub.planId]
            ) {
                oneTimeDeliveredSubscriptions.push(sub);
            } else if (sub.stateTitle !== "SUBSCRIPTION_DELIVERED") {
                presentedAdditionalSubscriptionsWithoutDeliveredDuplicates.push(sub);
            }
        }

        pendingActions = [
            ...pendingActions,
            // { type: "rate_recipes" },
        ];

        if (ratings.some((rating) => rating.isRateable(queryDate) && !rating.isRated())) pendingActions.push({ type: "rate_recipes", planName: "", orderId: "", shippment: "" });

        if (customer.friendCode) {
            //@ts-ignore
            pendingActions.push({
                type: "invite_code",
                //@ts-ignore
                couponCode: customer.friendCode,
                discountValue: "10 €",
            });
        }

        return {
            principalPlanSubscriptions: presentedPrincipalSubscriptions,
            additionalPlanSubscriptions: [...oneTimeDeliveredSubscriptions, ...presentedAdditionalSubscriptionsWithoutDeliveredDuplicates],
            pendingActions,
            friendCode: subscriptions[0]?.customer.friendCode,
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
