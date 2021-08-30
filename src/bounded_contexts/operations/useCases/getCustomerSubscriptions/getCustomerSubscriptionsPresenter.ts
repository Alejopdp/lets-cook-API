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
            if (
                subscription.state.title === "SUBSCRIPTION_CANCELLED" &&
                !cancelledSubscriptions.some((s) => s.plan.id.equals(subscription.plan.id))
            ) {
                cancelledSubscriptions.push(subscription);
            } else if (subscription.state.title !== "SUBSCRIPTION_CANCELLED") {
                nonCancelledSubscriptions.push(subscription);
            }
        }

        // const subscriptionsWithoutCancelledDuplicates = _.uniqBy(subscriptions, (subscription) =>
        //     [subscription.state.title, subscription.plan.id.value].join()
        // );
        for (let subscription of [...nonCancelledSubscriptions, ...cancelledSubscriptions]) {
            if (subscription.plan.isPrincipal()) {
                presentedPrincipalSubscriptions.push({
                    id: subscription.id.value,
                    planName: subscription.plan.name,
                    planVariantLabel: subscription.getPlanVariantLabel() || "4 recetas para 3 personas",
                    nextShippment: subscription.getNextShipmentLabel(orderSubscriptionMap[subscription.id.value]),
                    frequency: subscription.frequency.value(),
                    stateTitle: subscription.state.title,
                    stateHumanTitle: subscription.state.humanTitle,
                    stateColor: subscription.state.color,
                    iconUrl: await this.storageService.getPresignedUrlForFile(subscription.plan.iconLinealColorUrl),
                });
            } else {
                presentedAdditionalSubscriptions.push({
                    id: subscription.id.value,
                    planName: subscription.plan.name,
                    planVariantLabel: subscription.getPlanVariantLabel() || "4 recetas para 3 personas",
                    nextShippment: subscription.getNextShipmentLabel(orderSubscriptionMap[subscription.id.value]),
                    frequency: subscription.frequency.value(),
                    stateTitle: subscription.state.title,
                    stateHumanTitle: subscription.state.humanTitle,
                    stateColor: subscription.state.color,
                    iconUrl: await this.storageService.getPresignedUrlForFile(subscription.plan.iconLinealColorUrl),
                });
            }

            const nextOrder = subscription.getNextChoosableRecipesOrder(orderSubscriptionMap[subscription.id.value]);

            if (!!nextOrder && !nextOrder.hasChosenRecipes() && nextOrder.plan.abilityToChooseRecipes) {
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
            // { type: "invite_code", couponCode: "ALEJOAMIGOS", discountValue: "5%" },
        ];

        return {
            principalPlanSubscriptions: presentedPrincipalSubscriptions,
            additionalPlanSubscriptions: presentedAdditionalSubscriptions,
            pendingActions,
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
