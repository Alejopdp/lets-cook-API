import { Coupon } from "../../domain/cupons/Cupon";
import { ICouponRepository } from "../../infra/repositories/coupon/ICouponRepository";
import { GetCouponValidationDto } from "./getCouponValidationDto";
import { ISubscriptionRepository } from "../../infra/repositories/subscription/ISubscriptionRepository";
import { CustomerId } from "../../domain/customer/CustomerId";
import { Subscription } from "../../domain/subscription/Subscription";
import { IPlanRepository } from "../../infra/repositories/plan/IPlanRepository";
import { PlanId } from "../../domain/plan/PlanId";
import { Locale } from "../../domain/locale/Locale";
import { Plan } from "../../domain/plan/Plan";
import { PlanVariantId } from "../../domain/plan/PlanVariant/PlanVariantId";
export class GetCouponValidation {
    private _couponRepository: ICouponRepository;
    private _subscriptionRepository: ISubscriptionRepository;
    private _planRepository: IPlanRepository;

    constructor(couponRepository: ICouponRepository, subscriptionRepository: ISubscriptionRepository, planRepository: IPlanRepository) {
        this._couponRepository = couponRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._planRepository = planRepository;
    }

    public async execute(dto: GetCouponValidationDto): Promise<any> {
        const coupon: Coupon | undefined = await this.couponRepository.findActiveByCode(dto.coupon);
        if (!coupon) throw new Error("El cupón de descuento ingresado es incorrecto");

        const customerId: CustomerId = new CustomerId(dto.customerId);
        const planId: PlanId = new PlanId(dto.planId);
        const planVariantId: PlanVariantId = new PlanVariantId(dto.planVariantId);
        const plan: Plan = await this.planRepository.findByIdOrThrow(planId, Locale.es);
        const planPrice = plan.getPlanVariantPrice(planVariantId);
        const newPlanPriceAfterApplyingDiscount = (Math.round(planPrice * 100) - Math.round(coupon?.getDiscount(plan, planVariantId, dto.shippingCost) * 100)) / 100

        if (!coupon.isFreeShippingCoupon() && newPlanPriceAfterApplyingDiscount < 0) throw new Error("El cupón no es aplicable al importe del plan")
        if (!coupon.hasStarted()) throw new Error("El cupón ingresado no es válido");
        if (coupon.isExpiredByEndDate()) throw new Error("El cupón de descuento ingresado ha expirado");

        const customerSubscriptions: Subscription[] = await this.subscriptionRepository.findByCustomerId(customerId, Locale.es);

        if (!coupon.isValid(customerSubscriptions, plan, planVariantId, dto.shippingCost)) throw new Error("No puedes aplicar a este cupón");

        return coupon;
    }

    /**
     * Getter couponRepository
     * @return {ICouponRepository}
     */
    public get couponRepository(): ICouponRepository {
        return this._couponRepository;
    }

    /**
     * Getter subscriptionRepository
     * @return {ISubscriptionRepository}
     */
    public get subscriptionRepository(): ISubscriptionRepository {
        return this._subscriptionRepository;
    }

    /**
     * Getter planRepository
     * @return {IPlanRepository}
     */
    public get planRepository(): IPlanRepository {
        return this._planRepository;
    }
}
