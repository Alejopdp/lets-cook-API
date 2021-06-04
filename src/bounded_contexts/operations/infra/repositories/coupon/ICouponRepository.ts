import { Locale } from "../../../domain/locale/Locale";
import { Coupon } from "../../../domain/cupons/Cupon";
import { PlanId } from "../../../domain/plan/PlanId";

export interface ICouponRepository {
    save(coupon: Coupon): Promise<void>;
    findAll(): Promise<Coupon[]>;
    // findAllWithRecipesFlag(locale: Locale): Promise<Plan[]>;
    // findById(planId: PlanId, locale: Locale): Promise<Plan | undefined>;
    // findAdditionalPlanList(locale: Locale): Promise<Plan[]>;
    // findAdditionalPlanListById(ids: PlanId[], locale: Locale): Promise<Plan[]>
    // findBy(conditions: any, locale: Locale): Promise<Plan[]>;
    // delete(planId: PlanId): Promise<void>;
}
