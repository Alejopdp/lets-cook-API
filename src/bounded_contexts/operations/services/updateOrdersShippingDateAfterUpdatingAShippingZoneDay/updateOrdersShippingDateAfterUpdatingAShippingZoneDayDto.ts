import { Day } from "../../domain/day/Day";
import { ShippingZone } from "../../domain/shipping/ShippingZone";

export interface UpdateOrdersShippingDateAfterUpdatingAShippingZoneDayDto {
    shippingZone: ShippingZone;
    newShippingDayOfWeek: Day;
}
