import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Coupon } from "../../domain/cupons/Cupon";
import { ICouponType } from "../../domain/cupons/CuponType/ICuponType";
import { FixedPrice } from "../../domain/cupons/CuponType/FixedPrice";
import { FreeShipping } from "../../domain/cupons/CuponType/FreeShipping";
import { PercentPrice } from "../../domain/cupons/CuponType/PercentagePrice";
import { PlanId } from "../../domain/plan/PlanId";
import { CouponId } from "../../domain/cupons/CouponId";
import { PlanSku } from "../../domain/plan/PlanSku";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantAttribute } from "../../domain/plan/PlanVariant/PlanVariantAttribute";
import { PlanVariantWithRecipe } from "../../domain/plan/PlanVariant/PlanVariantWithRecipes";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { UpdateCuponStateDto } from "./updateCouponStateDto";

export class UpdateCoupon {
    private _couponRepository: ICouponRepository;
    private _storageService: IStorageService;

    constructor(couponRepository: ICouponRepository, storageService: IStorageService) {
        this._couponRepository = couponRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateCuponStateDto): Promise<void> {
        const couponId: CouponId = new CouponId(dto.id);
        const coupon: Coupon | undefined = await this.couponRepository.findById(couponId);
        if (!coupon) throw new Error("El cupon ingresado no existe");

        coupon.updateState(dto.state)

        // console.log("UseCase: ",coupon)

        await this.couponRepository.save(coupon);
    }

    /**
     * Getter planRepository
     * @return {ICouponRepository}
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
