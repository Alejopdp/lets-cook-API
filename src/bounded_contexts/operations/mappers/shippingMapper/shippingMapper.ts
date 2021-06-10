import { ShippingZoneId } from '../../domain/shipping/ShippingZoneId';
import { ShippingZone } from '../../domain/shipping/ShippingZone';
// import { planVariantMapper } from ".";
// import { logger } from "../../../../config";
import { Mapper } from "../../../../core/infra/Mapper";
import { Locale } from "../../domain/locale/Locale";
import { ShippingZoneRadio } from "../../domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../domain/shipping/ShippingZoneRadio/Coordinates";
import { FreeShipping } from "../../domain/cupons/CuponType/FreeShipping";
import { PercentPrice } from "../../domain/cupons/CuponType/PercentagePrice";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";
import { LimitQty } from "../../domain/cupons/LimitAplication/LimitQty";
import { FirstOrder } from "../../domain/cupons/LimitAplication/FirstOrder";
import { OnePerCustomer } from "../../domain/cupons/LimitAplication/OnePerCustomer";
import { PlanId } from "../../domain/plan/PlanId";

export class ShippingMapper implements Mapper<ShippingZone> {
    public toDomain(raw: any): ShippingZone {
        // const type: ShippingZoneRadio = raw.type.type === "fixed" ? new FixedPrice(raw.type.type, raw.type.value) : 
        //     raw.type.type === "free" ? new FreeShipping(raw.type.type, raw.type.value) : 
        //     new PercentPrice(raw.type.type, raw.type.value);
        // const productsForApplying: PlanId[] = raw.productsForApplyingValue.map((id: string) => new PlanId(id));
        const radio: ShippingZoneRadio = raw.radio.map((radio: any) => 
            new Coordinates(radio.latitude, radio.longitude));

        return ShippingZone.create(
            raw.name,
            raw.reference,
            raw.cost,
            raw.state,
            radio,
            new ShippingZoneId(raw._id)
        );
    }
    public toPersistence(t: ShippingZone): any {
        // const variants: any[] = t.planVariants.map((variant) => planVariantMapper.toPersistence(variant));
        // console.log("toPersistence: ",t)
        return {
            name: t.name,
            reference: t.reference,
            cost: t.cost,
            state: t.state,
            radio: t.radio,
            _id: t.id.value
        };
    }
}
