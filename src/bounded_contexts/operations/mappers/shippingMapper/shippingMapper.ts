import { ShippingZoneId } from "../../domain/shipping/ShippingZoneId";
import { ShippingZone } from "../../domain/shipping/ShippingZone";

import { Mapper } from "../../../../core/infra/Mapper";
import { ShippingZoneRadio } from "../../domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../domain/shipping/ShippingZoneRadio/Coordinates";
export class ShippingMapper implements Mapper<ShippingZone> {
    public toDomain(raw: any): ShippingZone {
        const radio: ShippingZoneRadio = raw.radio.map((radio: any) => new Coordinates(radio.latitude, radio.longitude));

        return ShippingZone.create(raw.name, raw.reference, raw.cost, raw.state, radio, new ShippingZoneId(raw._id));
    }
    public toPersistence(t: ShippingZone): any {
        return {
            name: t.name,
            reference: t.reference,
            cost: t.cost,
            state: t.state,
            radio: t.radio,
            _id: t.id.value,
        };
    }
}
