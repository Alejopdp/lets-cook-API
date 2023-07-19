import { CouponId } from "@src/bounded_contexts/operations/domain/cupons/CouponId";
import { Coupon } from "@src/bounded_contexts/operations/domain/cupons/Cupon";
import { ICouponRepository } from "./ICouponRepository";

export class InMemoryCouponRepository implements ICouponRepository {
    private coupons: Coupon[] = [];

    public constructor(coupons: Coupon[]) {
        this.coupons = coupons;
    }

    public async save(coupon: Coupon): Promise<void> {
        this.coupons.push(coupon);
    }
    saveMany(coupons: Coupon[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Coupon[]> {
        throw new Error("Method not implemented.");
    }
    findById(couponId: CouponId): Promise<Coupon | undefined> {
        throw new Error("Method not implemented.");
    }
    findByIdOrThrow(couponId: CouponId): Promise<Coupon> {
        throw new Error("Method not implemented.");
    }
    findByCode(couponCode: string): Promise<Coupon | undefined> {
        throw new Error("Method not implemented.");
    }
    findActiveByCode(couponCode: string): Promise<Coupon | undefined> {
        throw new Error("Method not implemented.");
    }
    deleteByCode(couponCode: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}