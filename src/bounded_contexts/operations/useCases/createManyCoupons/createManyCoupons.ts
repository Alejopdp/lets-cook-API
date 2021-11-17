import { CouponState } from "../../domain/cupons/CouponState";
import { Coupon } from "../../domain/cupons/Cupon";
import { CouponTypeFactory } from "../../domain/cupons/CuponType/CouponTypeFactory";
import { Locale } from "../../domain/locale/Locale";
import { Plan } from "../../domain/plan/Plan";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { CreateManyCouponsDto } from "./createManyCouponsDto";

export class CreateManyCoupons {
    private _couponRepository: ICouponRepository;
    private _planRepository: IPlanRepository;

    constructor(couponRepository: ICouponRepository, planRepository: IPlanRepository) {
        this._couponRepository = couponRepository;
        this._planRepository = planRepository;
    }

    public async execute(dto: CreateManyCouponsDto): Promise<any> {
        const someCouponAppliesToSpecificProducts = dto.couponsToCreate.some((coupon) => coupon.productsForApplyingType === "specific");
        const planSkuMap: { [sku: string]: Plan } = {};
        const plans: Plan[] = someCouponAppliesToSpecificProducts ? await this.planRepository.findAll(Locale.es) : [];
        const coupons: Coupon[] = [];

        for (let plan of plans) {
            planSkuMap[plan.planSku.code] = plan;
        }

        for (let couponToCreate of dto.couponsToCreate) {
            coupons.push(
                Coupon.create(
                    couponToCreate.couponCode,
                    CouponTypeFactory.create(couponToCreate.discountType, couponToCreate.discountValue),
                    couponToCreate.minRequireType,
                    couponToCreate.minRequireValue || 0,
                    couponToCreate.productsForApplyingType,
                    couponToCreate.productsForApplyingType === "specific"
                        ? couponToCreate.productsForApplyingValue.map((sku) => planSkuMap[sku].id)
                        : [],
                    couponToCreate.limites,
                    couponToCreate.maxChargeQtyType,
                    couponToCreate.maxChargeQtyValue,
                    couponToCreate.startDate || new Date(),
                    (<any>CouponState)[couponToCreate.state],
                    0,
                    [],
                    couponToCreate.endDate
                )
            );
        }

        await this.couponRepository.saveMany(coupons);

        return coupons;
    }

    /**
     * Getter couponRepository
     * @return {ICouponRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
