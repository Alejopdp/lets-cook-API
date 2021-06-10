import { ShippingZone } from './../../../domain/shipping/ShippingZone';
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
        // console.log("Test: ", shippingDb)
        if (await MongooseShippingZone.exists({ _id: shipping.id.value })) {
            console.log("Test: ", shipping.id.value, shippingDb)
            await MongooseShippingZone.updateOne(
                { _id: shipping.id.value }, 
                { $set: { 
                    name: shippingDb.name, 
                    reference: shippingDb.reference,
                    cost: shippingDb.cost,
                    state: shippingDb.state,
                    radio: shippingDb.radio
                } });
        } else {
            await MongooseShippingZone.create(shippingDb);
        }
    }

    public async updateState(shipping: ShippingZone): Promise<void> {
        const shippingDb = shippingMapper.toPersistence(shipping);
        console.log("Test: ", shipping.id.value, shippingDb)
        await MongooseShippingZone.updateOne({ _id: shipping.id.value }, { $set: { state: shippingDb.state} });
    }

    // private getRawPlanVariantsWithLocaleForUpdatingThem(planVariants: any[], locale: Locale): any {
    //     return planVariants.map((pv) => {
    //         const attributesWithLocale = pv.attributes.map((attribute: any) => {
    //             const { key, value, ...attributeToUpdate } = attribute;
    //             const keyLocale = `key.${locale}`;
    //             const valueLocale = `value.${locale}`;

    //             return { ...attributeToUpdate, [keyLocale]: key[locale], [valueLocale]: value[locale] };
    //         });

    //         return { ...pv, attributes: attributesWithLocale };
    //     });
    // }

    public async findById(couponId: ShippingZoneId): Promise<ShippingZone | undefined> {
        const shippingnDb = await MongooseShippingZone.findById(couponId.value, { deletionFlag: false });

        return shippingnDb ? shippingMapper.toDomain(shippingnDb) : undefined;
    }

    public async findAll(): Promise<ShippingZone[]> {
        return await this.findBy({});
    }

    // public async findAdditionalPlanList(locale: Locale): Promise<Plan[]> {
    //     return await this.findBy({ type: "Adicional" }, locale);
    // }

    // public async findAdditionalPlanListById(ids: PlanId[], locale: Locale): Promise<Plan[]> {
    //     return await this.findBy({ _id: ids, type: "Adicional" }, locale);
    // }

    public async findBy(conditions: any): Promise<ShippingZone[]> {
        const couponsDb = await MongooseShippingZone.find({ ...conditions, deletionFlag: false })
        return couponsDb.map((raw: any) => shippingMapper.toDomain(raw));
    }

    // public async findAllWithRecipesFlag(locale: Locale): Promise<Plan[]> {
    //     return await this.findBy({ hasRecipes: true }, locale);
    // }

    public async delete(shippingId: ShippingZoneId): Promise<void> {
        await MongooseShippingZone.deleteOne({ _id: shippingId.value });
    }
}
