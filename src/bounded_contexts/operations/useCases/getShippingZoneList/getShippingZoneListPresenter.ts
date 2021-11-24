import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
// import { PlanVariantWithRecipe } from "../../domain/plan/PlanVariant/PlanVariantWithRecipes";

export class GetShippingListPresenter {
    public static present(shippings: ShippingZone[]): any {
        const presentedShippingZones = [];

        for (let shipping of shippings) {
            presentedShippingZones.push({
                id: shipping.id.value,
                name: shipping.name,
                reference: shipping.reference,
                cost: shipping.cost,
                state: shipping.state,
                radio: shipping.radio,
            });
        }

        return presentedShippingZones;
    }
}
