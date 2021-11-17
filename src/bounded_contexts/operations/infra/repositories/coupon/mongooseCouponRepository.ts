import { Coupon } from "../../../domain/cupons/Cupon";
import { CouponId } from "../../../domain/cupons/CouponId";
import { ICouponRepository } from "./ICouponRepository";
import { Coupon as MongooseCoupon } from "../../../../../infraestructure/mongoose/models";
import { couponMapper } from "../../../mappers/couponMapper";
import { Locale } from "../../../domain/locale/Locale";
import { logger } from "../../../../../../config";
import { CouponState } from "../../../domain/cupons/CouponState";

export class MongooseCouponRepository implements ICouponRepository {
    public async save(coupon: Coupon): Promise<void> {
        const couponDb = couponMapper.toPersistence(coupon);
        if (await MongooseCoupon.exists({ _id: coupon.id.value })) {
            await MongooseCoupon.updateOne(
                { _id: coupon.id.value },
                // { $set: { state: couponDb.state, deletionFlag: couponDb.state === "deleted" ? true : false } }
                couponDb
            );
        } else {
            await MongooseCoupon.create(couponDb);
        }
    }

    public async saveMany(coupons: Coupon[]): Promise<void> {
        const couponsDb = coupons.map((coupon) => couponMapper.toPersistence(coupon));

        await MongooseCoupon.insertMany(couponsDb);
    }

    public async findById(couponId: CouponId): Promise<Coupon | undefined> {
        const couponDb = await MongooseCoupon.findById(couponId.value, { deletionFlag: false });

        return couponDb ? couponMapper.toDomain(couponDb) : undefined;
    }

    public async findByIdOrThrow(couponId: CouponId): Promise<Coupon> {
        const couponDb = await MongooseCoupon.findById(couponId.value, { deletionFlag: false });
        if (!!!couponDb) throw new Error("El cupón ingresado no existe");

        return couponMapper.toDomain(couponDb);
    }

    public async findByCode(couponCode: string): Promise<Coupon | undefined> {
        const couponDb = await MongooseCoupon.findOne({ couponCode: couponCode.toUpperCase(), deletionFlag: false });

        return couponDb ? couponMapper.toDomain(couponDb) : undefined;
    }

    public async findActiveByCode(couponCode: string): Promise<Coupon | undefined> {
        const couponDb = await MongooseCoupon.findOne({
            couponCode: couponCode.toUpperCase(),
            deletionFlag: false,
            state: CouponState.ACTIVE,
        });

        return couponDb ? couponMapper.toDomain(couponDb) : undefined;
    }

    public async findAll(): Promise<Coupon[]> {
        return await this.findBy({ state: { $not: { $in: [CouponState.DELETED] } } });
    }

    public async findBy(conditions: any): Promise<Coupon[]> {
        const couponsDb = await MongooseCoupon.find({ ...conditions, deletionFlag: false }).sort({ createdAt: -1 });
        return couponsDb.map((raw: any) => couponMapper.toDomain(raw));
    }

    public async deleteByCode(couponCode: string): Promise<void> {
        await MongooseCoupon.findOneAndUpdate({ couponCode }, { state: CouponState.DELETED });
    }
}
