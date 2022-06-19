import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Locale } from "../../domain/locale/Locale";
// import { PlanVariantWithRecipe } from "../../domain/plan/PlanVariant/PlanVariantWithRecipes";

export class GetShippingRatePresenter {
    public present(shippingZone: ShippingZone, hasNextShipping: boolean, locale: Locale): any {
        return {
            id: shippingZone.id.value,
            name: shippingZone.name,
            reference: shippingZone.reference,
            cost: shippingZone.cost,
            state: shippingZone.state,
            radio: shippingZone.radio,
            dayLabel: shippingZone.getDayLabel(locale),
            dayNumberOfWeek: shippingZone.getDayNumberOfWeek(),
            nextShippingDate: shippingZone.getHumanNextShippingDate(locale),
            hasNextShipping,
        };
    }
}
