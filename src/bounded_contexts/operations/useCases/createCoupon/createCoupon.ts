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
import { CouponState } from "../../domain/cupons/CouponState";

export class CreateCoupon {
    private _couponRepository: ICouponRepository;

    constructor(couponRepository: ICouponRepository) {
        this._couponRepository = couponRepository;
    }

    public async execute(dto: CreateCouponDto): Promise<void> {
        const type: ICouponType =
            dto.discountType === "fix"
                ? new FixedPrice(dto.discountType, dto.discountValue)
                : dto.discountType === "free"
                ? new FreeShipping(dto.discountType, dto.discountValue)
                : new PercentPrice(dto.discountType, dto.discountValue);

        const productsForApplying: PlanId[] = dto.productsForApplyingValue.map((plan: any) => new PlanId(plan.id));

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
            CouponState.ACTIVE,
            0,
            [],
            dto.endDate
        );

        const activeCouponWithSameCode: Coupon | undefined = await this.couponRepository.findActiveByCode(coupon.couponCode);

        if (activeCouponWithSameCode) throw new Error("Ya existe un cupón activo con el mismo código ingresado");

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
