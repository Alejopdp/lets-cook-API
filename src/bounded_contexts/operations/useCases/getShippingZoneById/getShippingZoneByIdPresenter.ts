import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { PlanId } from "../../domain/plan/PlanId";

export class GetShippingZoneByIdPresenter {
    public static present(shipping: ShippingZone): any {
        return {
            id: shipping.id.value,
            name: shipping.name,
            reference: shipping.reference,
            cost: shipping.cost,
            state: shipping.state,
            radio: shipping.radio,
        };
    }
}
