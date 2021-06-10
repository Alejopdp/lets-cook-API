import { Locale } from "../../../domain/locale/Locale";
import { ShippingZone } from "../../../domain/shipping/ShippingZone";
import { ShippingZoneId } from "../../../domain/shipping/ShippingZoneId";

export interface IShippingZoneRepository {
    save(shipping: ShippingZone): Promise<void>;
    findAll(): Promise<ShippingZone[]>;
    updateState(state: ShippingZone): Promise<void>;
    findById(planId: ShippingZoneId): Promise<ShippingZone | undefined>;
    // findAdditionalPlanList(locale: Locale): Promise<Plan[]>;
    // findAdditionalPlanListById(ids: PlanId[], locale: Locale): Promise<Plan[]>
    // findBy(conditions: any, locale: Locale): Promise<Plan[]>;
    delete(planId: ShippingZoneId): Promise<void>;
}
