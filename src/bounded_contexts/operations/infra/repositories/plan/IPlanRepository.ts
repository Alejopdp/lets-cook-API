import { Plan } from "../../../domain/plan/Plan";
import { PlanId } from "../../../domain/plan/PlanId";

export interface IPlanRepository {
    save(plan: Plan): Promise<void>;
    findAll(): Promise<Plan[]>;
    findById(planId: PlanId): Promise<Plan | undefined>;
    findBy(conditions: any): Promise<Plan[]>;
    delete(planId: PlanId): Promise<void>;
}
