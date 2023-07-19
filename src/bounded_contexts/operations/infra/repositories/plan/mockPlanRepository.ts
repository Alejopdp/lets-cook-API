import { Locale } from "../../../domain/locale/Locale";
import { Plan } from "../../../domain/plan/Plan";
import { PlanId } from "../../../domain/plan/PlanId";
import { PlanType } from "../../../domain/plan/PlanType/PlanType";
import { PlanVariantId } from "../../../domain/plan/PlanVariant/PlanVariantId";
import { IPlanRepository } from "./IPlanRepository";

export class InMemoryPlanRepository implements IPlanRepository {
    private _plans: Plan[];

    constructor(plans: Plan[]) {
        this._plans = plans;
    }

    public async findByIdOrThrow(planId: PlanId, locale: Locale): Promise<Plan> {
        const plan = await this.plans.find((plan) => plan.id.equals(planId));

        if (!plan) {
            throw new Error("Plan not found");
        }

        return plan;
    }
    findPlanAhorro(locale: Locale): Promise<Plan | undefined> {
        throw new Error("Method not implemented.");
    }

    findByPlanVariantId(planVariantId: PlanVariantId): Promise<Plan | undefined> {
        throw new Error("Method not implemented.");
    }

    public async bulkSave(plans: Plan[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    findAdditionalPlanListById(ids: PlanId[], locale: Locale): Promise<Plan[]> {
        throw new Error("Method not implemented.");
    }

    public async save(plan: Plan): Promise<void> {
        const planIndex = this.plans.findIndex((p) => p.id.equals(plan.id));
        if (planIndex !== -1) {
            this.plans[planIndex] = plan;
            return;
        }
        else {
            this.plans.push(plan);
            return;
        }

    }

    public async findById(planId: PlanId): Promise<Plan | undefined> {
        return this.plans.find((p) => p.id.equals(planId));
    }

    public async findAll(): Promise<Plan[]> {
        return this.plans;
    }

    public async findAdditionalPlanList(): Promise<Plan[]> {
        return this.plans.filter((plan) => plan.type === PlanType.Adicional);
    }

    public async findBy(conditions: any): Promise<Plan[]> {
        throw new Error("Method not implemented.");
    }

    public async findAllWithRecipesFlag(): Promise<Plan[]> {
        return this.plans.filter((plan) => plan.hasRecipes);
    }

    public async delete(planId: PlanId): Promise<void> {
        this.plans = this.plans.filter((p) => !p.id.equals(planId));
    }

    /**
     * Getter plans
     * @return {Plan[]}
     */
    public get plans(): Plan[] {
        return this._plans;
    }

    /**
     * Setter plans
     * @param {Plan[]} value
     */
    public set plans(value: Plan[]) {
        this._plans = value;
    }
}
