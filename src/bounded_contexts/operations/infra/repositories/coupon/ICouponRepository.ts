import { Coupon } from "../../../domain/cupons/Cupon";
import { CouponId } from "../../../domain/cupons/CouponId";

export interface ICouponRepository {
    save(coupon: Coupon): Promise<void>;
    findAll(): Promise<Coupon[]>;
    findById(planId: CouponId): Promise<Coupon | undefined>;
}
