import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Locale } from "../../domain/locale/Locale";
import { Coupon } from "../../domain/cupons/Cupon";
import { PlanId } from "../../domain/plan/PlanId";
import { ICouponType } from "../../domain/cupons/CuponType/ICuponType";
import { FixedPrice } from "../../domain/cupons/CuponType/FixedPrice";
import { FreeShipping } from "../../domain/cupons/CuponType/FreeShipping";
import { PercentPrice } from "../../domain/cupons/CuponType/PercentagePrice";
import { ILimitAplication } from "../../domain/cupons/LimitAplication/ILimitAplication";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { CreateCouponCSVDto } from "./createCouponDto";
import { CouponState } from "../../domain/cupons/CouponState";

export class CreateCoupon {
    private _couponRepository: ICouponRepository;
    private _storageService: IStorageService;

    constructor(couponRepository: ICouponRepository, storageService: IStorageService) {
        this._couponRepository = couponRepository;
        this._storageService = storageService;
    }

    public async execute(dto: CreateCouponCSVDto): Promise<void> {
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
            CouponState.ACTIVE,
            0,
            [],
            dto.endDate
        );
        const couponWithSameCode: Coupon | undefined = await this.couponRepository.findActiveByCode(coupon.couponCode);

        if (couponWithSameCode) throw new Error("Ya existe un cupón activo con el mismo código ingresado");

        await this.couponRepository.save(coupon);
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
