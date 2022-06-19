import { ShippingZone } from "../../domain/shipping/ShippingZone";
import { Locale } from "../../domain/locale/Locale";

export class GetShippingZoneByIdPresenter {
    public static present(shipping: ShippingZone, locale: Locale): any {
        return {
            id: shipping.id.value,
            name: shipping.name,
            reference: shipping.reference,
            cost: shipping.cost,
            state: shipping.state,
            radio: shipping.radio,
            shippingDayOfWeek: shipping.getDayNumberOfWeek(),
            shippingDayOfWeekLabel: shipping.getDayLabel(locale),
        };
    }
}
