import { Locale } from "../../../domain/locale/Locale";
import { Plan } from "../../../domain/plan/Plan";
import { PlanId } from "../../../domain/plan/PlanId";
import { PlanVariantId } from "../../../domain/plan/PlanVariant/PlanVariantId";

export interface IPlanRepository {
    save(plan: Plan): Promise<void>;
    bulkSave(plans: Plan[]): Promise<void>;
    findAll(locale: Locale): Promise<Plan[]>;
    findAllWithRecipesFlag(locale: Locale): Promise<Plan[]>;
    findById(planId: PlanId, locale: Locale): Promise<Plan | undefined>;
    findByPlanVariantId(planVariantId: PlanVariantId): Promise<Plan | undefined>;
    findAdditionalPlanList(locale: Locale): Promise<Plan[]>;
    findAdditionalPlanListById(ids: PlanId[], locale: Locale): Promise<Plan[]>;
    findByIdOrThrow(planId: PlanId, locale: Locale): Promise<Plan>;
    findBy(conditions: any, locale: Locale): Promise<Plan[]>;
    findPlanAhorro(locale: Locale): Promise<Plan | undefined>;
    delete(planId: PlanId): Promise<void>;
    // findPlanById(planId: PlanId): Promise<Plan | undefined>;
}
