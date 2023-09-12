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
    public async findAll(): Promise<Coupon[]> {
        return this.coupons;
    }

    public async findById(couponId: CouponId): Promise<Coupon | undefined> {
        return this.coupons.find((coupon) => coupon.id.equals(couponId));
    }

    public async findByIdOrThrow(couponId: CouponId): Promise<Coupon> {
        const coupon: Coupon | undefined = await this.findById(couponId);

        if (!coupon) throw new Error("Coupon not found");

        return coupon;
    }

    public async findByCode(couponCode: string): Promise<Coupon | undefined> {
        return this.coupons.find((coupon) => coupon.couponCode === couponCode);
    }


    public async findActiveByCode(couponCode: string): Promise<Coupon | undefined> {
        return this.coupons.find((coupon) => coupon.couponCode === couponCode && coupon.state === "ACTIVE");
    }
    deleteByCode(couponCode: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}