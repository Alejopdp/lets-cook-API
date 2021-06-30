import { Locale } from "../../../domain/locale/Locale";
import { Plan } from "../../../domain/plan/Plan";
import { PlanId } from "../../../domain/plan/PlanId";
import { PlanType } from "../../../domain/plan/PlanType/PlanType";
import { PlanVariantId } from "../../../domain/plan/PlanVariant/PlanVariantId";
import { IPlanRepository } from "./IPlanRepository";

export class MockPlanRepository implements IPlanRepository {
    private _database: Plan[];

    constructor(database: Plan[]) {
        this._database = database;
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
        console.log("Plan: ", plan);
        const filtered = this.database.filter((p) => !p.equals(plan));
        this.database = [...filtered, plan];
    }

    public async findById(planId: PlanId): Promise<Plan | undefined> {
        return this.database.find((p) => p.id.equals(planId));
    }

    public async findAll(): Promise<Plan[]> {
        return this.database;
    }

    public async findAdditionalPlanList(): Promise<Plan[]> {
        return this.database.filter((plan) => plan.type === PlanType.Adicional);
    }

    public async findBy(conditions: any): Promise<Plan[]> {
        throw new Error("Method not implemented.");
    }

    public async findAllWithRecipesFlag(): Promise<Plan[]> {
        return this.database.filter((plan) => plan.hasRecipes);
    }

    public async delete(planId: PlanId): Promise<void> {
        this.database = this.database.filter((p) => !p.id.equals(planId));
    }

    /**
     * Getter database
     * @return {Plan[]}
     */
    public get database(): Plan[] {
        return this._database;
    }

    /**
     * Setter database
     * @param {Plan[]} value
     */
    public set database(value: Plan[]) {
        this._database = value;
    }
}
