import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { PlanId } from "../../domain/plan/PlanId";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantWithRecipe } from "../../domain/plan/PlanVariant/PlanVariantWithRecipes";

export class GetShippingRatePresenter {
    public present(shippingZone: ShippingZone, hasNextShipping: boolean): any {
        return {
            id: shippingZone.id.value,
            name: shippingZone.name,
            reference: shippingZone.reference,
            cost: shippingZone.cost,
            state: shippingZone.state,
            radio: shippingZone.radio,
            dayLabel: shippingZone.getDayLabel(),
            dayNumberOfWeek: shippingZone.getDayNumberOfWeek(),
            nextShippingDate: shippingZone.getHumanNextShippingDate(),
            hasNextShipping,
        };
    }
}
