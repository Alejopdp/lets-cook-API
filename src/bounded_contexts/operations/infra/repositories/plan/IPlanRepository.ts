import { Locale } from "../../../domain/locale/Locale";
import { Plan } from "../../../domain/plan/Plan";
import { PlanId } from "../../../domain/plan/PlanId";

export interface IPlanRepository {
    save(plan: Plan): Promise<void>;
    findAll(locale: Locale): Promise<Plan[]>;
    findAllWithRecipesFlag(locale: Locale): Promise<Plan[]>;
    findById(planId: PlanId, locale: Locale): Promise<Plan | undefined>;
    findAdditionalPlanList(locale: Locale): Promise<Plan[]>;
    findAdditionalPlanListById(ids: PlanId[], locale: Locale): Promise<Plan[]>
    findBy(conditions: any, locale: Locale): Promise<Plan[]>;
    delete(planId: PlanId): Promise<void>;
    // findPlanById(planId: PlanId): Promise<Plan | undefined>;
}
