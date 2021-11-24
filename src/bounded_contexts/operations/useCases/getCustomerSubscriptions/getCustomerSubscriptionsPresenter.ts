import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { Subscription } from "../../domain/subscription/Subscription";
import { v4 as uuid } from "uuid";
import { Order } from "../../domain/order/Order";
import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import _ from "lodash";

export class GetCustomerSubscriptionsPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(subscriptions: Subscription[], nextOrders: Order[]): Promise<any> {
        const presentedPrincipalSubscriptions = [];
        const presentedAdditionalSubscriptions = [];
        const orderSubscriptionMap: { [key: string]: Order[] } = {};
        const cancelledSubscriptions: Subscription[] = [];
        const nonCancelledSubscriptions: Subscription[] = [];
        var pendingActions = [];

        for (let order of nextOrders) {
            orderSubscriptionMap[order.subscriptionId.value] = Array.isArray(orderSubscriptionMap[order.subscriptionId.value])
                ? [...orderSubscriptionMap[order.subscriptionId.value], order]
                : [order];
        }

        for (let subscription of subscriptions) {
            if (subscription.state.isCancelled() && !cancelledSubscriptions.some((s) => s.plan.id.equals(subscription.plan.id))) {
                cancelledSubscriptions.push(subscription);
            } else if (!subscription.state.isCancelled()) {
                nonCancelledSubscriptions.push(subscription);
            }
        }

        // const subscriptionsWithoutCancelledDuplicates = _.uniqBy(subscriptions, (subscription) =>
        //     [subscription.state.title, subscription.plan.id.value].join()
        // );
        for (let subscription of [...nonCancelledSubscriptions, ...cancelledSubscriptions]) {
            const presentedSubscription = {
                id: subscription.id.value,
                planId: subscription.plan.id.value,
                planVariantPrice: subscription.price,
                planVariantId: subscription.planVariantId.value,
                planName: subscription.plan.name,
                planVariantLabel: subscription.getPlanVariantLabel() || "",
                nextShippment: subscription.getNextShipmentLabel(orderSubscriptionMap[subscription.id.value]),
                frequency: subscription.frequency.value(),
                stateTitle:
                    !!!orderSubscriptionMap[subscription.id.value] && subscription.frequency.isOneTime()
                        ? "SUBSCRIPTION_DELIVERED"
                        : subscription.state.title,
                stateHumanTitle:
                    !!!orderSubscriptionMap[subscription.id.value] && subscription.frequency.isOneTime()
                        ? "Entregado"
                        : subscription.state.humanTitle,
                stateColor: subscription.state.color,
                iconUrl: await this.storageService.getPresignedUrlForFile(subscription.plan.iconLinealColorUrl),
            };
            if (subscription.plan.isPrincipal()) {
                presentedPrincipalSubscriptions.push(presentedSubscription);
            } else {
                presentedAdditionalSubscriptions.push(presentedSubscription);
            }

            const nextOrder = subscription.getNextChoosableRecipesOrder(orderSubscriptionMap[subscription.id.value]);

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
                    shippment: nextOrder.getPendingRecipeChooseLabel(),
                    orderId: nextOrder.id.value,
                });
            }
        }

        pendingActions = [
            ...pendingActions,
            // { type: "rate_recipes" },
        ];

        if (!!subscriptions[0]?.customer.friendCode) {
            //@ts-ignore
            pendingActions.push({ type: "invite_code", couponCode: subscriptions[0]?.customer.friendCode || "", discountValue: "10 €" });
        }

        return {
            principalPlanSubscriptions: presentedPrincipalSubscriptions,
            additionalPlanSubscriptions: presentedAdditionalSubscriptions,
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
