import { ShippingZone } from "@src/bounded_contexts/operations/domain/shipping/ShippingZone";
import { ShippingZoneId } from "@src/bounded_contexts/operations/domain/shipping/ShippingZoneId";
import { IShippingZoneRepository } from "./IShippingZoneRepository";

export class InMemoryShippingZoneRepository implements IShippingZoneRepository {
    save(shipping: ShippingZone): Promise<void> {
        throw new Error("Method not implemented.");
    }
    saveBulk(shippingZones: ShippingZone[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<ShippingZone[]> {
        throw new Error("Method not implemented.");
    }
    findAllActive(): Promise<ShippingZone[]> {
        throw new Error("Method not implemented.");
    }
    updateState(state: ShippingZone): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findById(planId: ShippingZoneId): Promise<ShippingZone | undefined> {
        throw new Error("Method not implemented.");
    }
    delete(planId: ShippingZoneId): Promise<void> {
        throw new Error("Method not implemented.");
    }

}