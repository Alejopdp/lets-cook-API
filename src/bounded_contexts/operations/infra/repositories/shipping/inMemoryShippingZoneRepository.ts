import { ShippingZone } from "@src/bounded_contexts/operations/domain/shipping/ShippingZone";
import { ShippingZoneId } from "@src/bounded_contexts/operations/domain/shipping/ShippingZoneId";
import { IShippingZoneRepository } from "./IShippingZoneRepository";

export class InMemoryShippingZoneRepository implements IShippingZoneRepository {

    private shippingZones: ShippingZone[] = [];

    public constructor(shippingZones: ShippingZone[]) {
        this.shippingZones = shippingZones;
    }


    public async save(shipping: ShippingZone): Promise<void> {
        const shippingZoneIndex = this.shippingZones.findIndex((shippingZone) => shippingZone.id.value === shipping.id.value);
        if (shippingZoneIndex !== -1) {
            this.shippingZones[shippingZoneIndex] = shipping;
        }
        else {
            this.shippingZones.push(shipping);
        }


    }
    saveBulk(shippingZones: ShippingZone[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<ShippingZone[]> {
        throw new Error("Method not implemented.");
    }
    public async findAllActive(): Promise<ShippingZone[]> {
        return this.shippingZones.filter((shippingZone) => shippingZone.state === "active");
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