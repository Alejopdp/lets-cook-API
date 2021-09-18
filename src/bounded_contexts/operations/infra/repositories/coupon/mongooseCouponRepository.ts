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
        // console.log("Test: ", couponDb)
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

    public async findById(couponId: CouponId): Promise<Coupon | undefined> {
        const couponDb = await MongooseCoupon.findById(couponId.value, { deletionFlag: false });

        return couponDb ? couponMapper.toDomain(couponDb) : undefined;
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
        return await this.findBy({});
    }

    public async findBy(conditions: any): Promise<Coupon[]> {
        const couponsDb = await MongooseCoupon.find({ ...conditions, deletionFlag: false });
        return couponsDb.map((raw: any) => couponMapper.toDomain(raw));
    }
}
