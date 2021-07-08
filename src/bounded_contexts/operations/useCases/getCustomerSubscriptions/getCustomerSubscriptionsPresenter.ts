import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { Subscription } from "../../domain/subscription/Subscription";
import { v4 as uuid } from "uuid";
import { Order } from "../../domain/order/Order";
import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";

export class GetCustomerSubscriptionsPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public async present(subscriptions: Subscription[], nextOrders: Order[]): Promise<any> {
        const presentedPrincipalSubscriptions = [];
        const presentedAdditionalSubscriptions = [];
        const orderSubscriptionMap: { [key: string]: Order[] } = {};
        var pendingActions = [];

        // console.log("NExt orders: ", nextOrders);
        // console.log("SUBSCRIPTIONS: ", subscriptions);
        // console.log("Orders.length: ", nextOrders.length);
        for (let order of nextOrders) {
            orderSubscriptionMap[order.subscriptionId.value] = Array.isArray(orderSubscriptionMap[order.subscriptionId.value])
                ? [...orderSubscriptionMap[order.subscriptionId.value], order]
                : [order];
        }
        // console.log("ORDERS MAP:_ ", orderSubscriptionMap);

        for (let subscription of subscriptions) {
            if (subscription.plan.isPrincipal()) {
                presentedPrincipalSubscriptions.push({
                    id: subscription.id.value,
                    planName: subscription.plan.name,
                    planVariantLabel: subscription.getPlanVariantLabel() || "4 recetas para 3 personas",
                    nextShippment: subscription.getNextShipmentLabel(orderSubscriptionMap[subscription.id.value]),
                    frequency: PlanFrequency.Semanal,
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
                    frequency: PlanFrequency.Semanal,
                    stateTitle: subscription.state.title,
                    stateHumanTitle: subscription.state.humanTitle,
                    stateColor: subscription.state.color,
                    iconUrl: await this.storageService.getPresignedUrlForFile(subscription.plan.iconLinealColorUrl),
                });
            }

            const nextOrder = subscription.getNextActiveOrder(orderSubscriptionMap[subscription.id.value]);

            if (!!nextOrder && !nextOrder.hasChosenRecipes()) {
                pendingActions.push({
                    type: "choose_recipes",
                    planName: nextOrder.plan.name,
                    shippment: nextOrder.getPendingRecipeChooseLabel(),
                });
            }
        }

        pendingActions = [
            ...pendingActions,
            { type: "rate_recipes" },
            { type: "invite_code", couponCode: "ALEJOAMIGOS", discountValue: "5%" },
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
