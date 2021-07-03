import { Coupon } from "../../../domain/cupons/Cupon";
import { CouponId } from "../../../domain/cupons/CouponId";

export interface ICouponRepository {
    save(coupon: Coupon): Promise<void>;
    findAll(): Promise<Coupon[]>;
    findById(couponId: CouponId): Promise<Coupon | undefined>;
    findByCode(couponCode: string): Promise<Coupon | undefined>;
}
