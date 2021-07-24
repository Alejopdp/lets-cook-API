import { ShippingZoneId } from "../../domain/shipping/ShippingZoneId";
import { ShippingZone } from "../../domain/shipping/ShippingZone";

import { Mapper } from "../../../../core/infra/Mapper";
import { ShippingZoneRadio } from "../../domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../domain/shipping/ShippingZoneRadio/Coordinates";
import { Day } from "../../domain/day/Day";
export class ShippingMapper implements Mapper<ShippingZone> {
    public toDomain(raw: any): ShippingZone {
        const radio: ShippingZoneRadio = new ShippingZoneRadio(
            raw.radio.map((radio: any) => new Coordinates(radio.latitude, radio.longitude))
        );
        const shippingDay: Day = new Day(raw.shippingDayOfWeek || 3);

        return ShippingZone.create(raw.name, raw.reference, raw.cost, raw.state, radio, shippingDay, new ShippingZoneId(raw._id));
    }
    public toPersistence(t: ShippingZone): any {
        const radio = t.radio.coordinates.map((coord) => ({ latitude: coord.latitude, longitude: coord.longitude }));

        return {
            name: t.name,
            reference: t.reference,
            cost: t.cost,
            state: t.state,
            radio,
            shippingDayOfWeek: t.shippingDayOfWeek.dayNumberOfWeek,
            _id: t.id.value,
        };
    }
}
