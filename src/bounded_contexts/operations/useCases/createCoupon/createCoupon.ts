import { logger } from "../../../../../config";
import { Coupon } from "../../domain/cupons/Cupon";
import { PlanId } from "../../domain/plan/PlanId";
import { ICouponType } from "../../domain/cupons/CuponType/ICuponType";
import { FixedPrice } from "../../domain/cupons/CuponType/FixedPrice";
import { FreeShipping } from "../../domain/cupons/CuponType/FreeShipping";
import { PercentPrice } from "../../domain/cupons/CuponType/PercentagePrice";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { CreateCouponDto } from "./createCouponDto";

export class CreateCoupon {
    private _couponRepository: ICouponRepository;

    constructor(couponRepository: ICouponRepository) {
        this._couponRepository = couponRepository;
    }

    public async execute(dto: CreateCouponDto): Promise<void> {
        const type: ICouponType =
            dto.discountType === "fixed"
                ? new FixedPrice(dto.discountType, dto.discountValue)
                : dto.discountType === "free"
                ? new FreeShipping(dto.discountType, dto.discountValue)
                : new PercentPrice(dto.discountType, dto.discountValue);
        const productsForApplying: PlanId[] = dto.productsForApplyingValue.map((id: string) => new PlanId(id));

        const coupon: Coupon = Coupon.create(
            dto.couponCode,
            type,
            dto.minRequireType,
            dto.minRequireValue,
            dto.productsForApplyingType,
            productsForApplying,
            dto.limites,
            dto.maxChargeQtyType,
            dto.maxChargeQtyValue,
            dto.startDate,
            dto.endDate,
            "active"
        );
        await this.couponRepository.save(coupon);
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
    }
}
