import { ShippingZone } from "./../../../domain/shipping/ShippingZone";
import { Coupon } from "../../../domain/cupons/Cupon";
import { ShippingZoneId } from "../../../domain/shipping/ShippingZoneId";
import { IShippingZoneRepository } from "./IShippingZoneRepository";
import { Shipping as MongooseShippingZone } from "../../../../../infraestructure/mongoose/models";
import { shippingMapper } from "../../../mappers/shippingMapper";
import { Locale } from "../../../domain/locale/Locale";
import { logger } from "../../../../../../config";

export class MongooseShippingRepository implements IShippingZoneRepository {
    public async save(shipping: ShippingZone): Promise<void> {
        const shippingDb = shippingMapper.toPersistence(shipping);
        if (await MongooseShippingZone.exists({ _id: shipping.id.value })) {
            await MongooseShippingZone.updateOne(
                { _id: shipping.id.value },
                {
                    $set: {
                        name: shippingDb.name,
                        reference: shippingDb.reference,
                        cost: shippingDb.cost,
                        state: shippingDb.state,
                        radio: shippingDb.radio,
                        shippingDayOfWeek: shippingDb.shippingDayOfWeek,
                    },
                }
            );
        } else {
            await MongooseShippingZone.create(shippingDb);
        }
    }

    public async saveBulk(shippingZones: ShippingZone[]): Promise<void> {
        const shippingZonesToSave = shippingZones.map((shippingZone) => shippingMapper.toPersistence(shippingZone));

        await MongooseShippingZone.insertMany(shippingZonesToSave);
    }

    public async updateState(shipping: ShippingZone): Promise<void> {
        const shippingDb = shippingMapper.toPersistence(shipping);
        await MongooseShippingZone.updateOne({ _id: shipping.id.value }, { $set: { state: shippingDb.state } });
    }

    public async findById(couponId: ShippingZoneId): Promise<ShippingZone | undefined> {
        const shippingnDb = await MongooseShippingZone.findById(couponId.value, { deletionFlag: false });

        return shippingnDb ? shippingMapper.toDomain(shippingnDb) : undefined;
    }

    public async findAll(): Promise<ShippingZone[]> {
        return await this.findBy({});
    }

    public async findAllActive(): Promise<ShippingZone[]> {
        return await this.findBy({ state: "active", deletionFlag: false });
    }

    public async findBy(conditions: any): Promise<ShippingZone[]> {
        const couponsDb = await MongooseShippingZone.find({ ...conditions, deletionFlag: false });
        return couponsDb.map((raw: any) => shippingMapper.toDomain(raw));
    }

    public async delete(shippingId: ShippingZoneId): Promise<void> {
        await MongooseShippingZone.updateOne({ _id: shippingId.value }, { $set: { deletionFlag: true } });
    }
}
