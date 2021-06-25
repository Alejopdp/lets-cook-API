import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { Subscription } from "../../domain/subscription/Subscription";
import { v4 as uuid } from "uuid";

export class GetCustomerSubscriptionPresenter {
    public static present(subscriptions: Subscription[]): any {
        const presentedPrincipalSubscriptions = [];
        const presentedAdditionalSubscriptions = [];

        for (let i = 0; i < 4; i++) {
            presentedPrincipalSubscriptions.push({
                // id: subscription.id.value,
                id: uuid(),
                planName: "Plan familiar",
                planVariantLabel: "4 recetas para 3 personas",
                nextShippment: "12 de Junio",
                frequency: PlanFrequency.Semanal,
                stateTitle: "SUBSCRIPTION_ACTIVE",
                stateHumanTitle: "Activo",
                stateColor: "#00A555",
            });
        }

        for (let i = 0; i < 4; i++) {
            presentedAdditionalSubscriptions.push({
                // id: subscription.id.value,
                id: uuid(),
                planName: "Plan familiar",
                planVariantLabel: "4 recetas para 3 personas",
                nextShippment: "12 de Junio",
                frequency: PlanFrequency.Semanal,
                stateTitle: "SUBSCRIPTION_ACTIVE",
                stateHumanTitle: "Activo",
                stateColor: "#00A555",
            });
        }

        const pendingActions = [
            { type: "choose_recipes", planName: "Plan Familiar", shippment: "12 de Junio" },
            { type: "choose_recipes", planName: "Plan Vegetariano", shippment: "12 de Junio" },
            { type: "choose_recipes", planName: "Plan Gourmet", shippment: "12 de Junio" },
            { type: "rate_recipes" },
            { type: "invite_code", couponCode: "ALEJOAMIGOS", discountValue: "5%" },
        ];

        return {
            principalPlanSubscriptions: presentedPrincipalSubscriptions,
            additionalPlanSubscriptions: presentedAdditionalSubscriptions,
            pendingActions,
        };
    }
}
