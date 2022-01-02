import { Locale } from "../../../domain/locale/Locale";
import { ShippingZone } from "../../../domain/shipping/ShippingZone";
import { ShippingZoneId } from "../../../domain/shipping/ShippingZoneId";

export interface IShippingZoneRepository {
    save(shipping: ShippingZone): Promise<void>;
    saveBulk(shippingZones: ShippingZone[]): Promise<void>;
    findAll(): Promise<ShippingZone[]>;
    findAllActive(): Promise<ShippingZone[]>;
    updateState(state: ShippingZone): Promise<void>;
    findById(planId: ShippingZoneId): Promise<ShippingZone | undefined>;
    delete(planId: ShippingZoneId): Promise<void>;
}
