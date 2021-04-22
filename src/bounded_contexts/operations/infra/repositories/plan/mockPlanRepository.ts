import { Plan } from "../../../domain/plan/Plan";
import { PlanId } from "../../../domain/plan/PlanId";
import { IPlanRepository } from "./IPlanRepository";

export class MockPlanRepository implements IPlanRepository {
    private _database: Plan[];

    constructor(database: Plan[]) {
        this._database = database;
    }

    public async save(plan: Plan): Promise<void> {
        const filtered = this.database.filter((p) => !p.equals(plan));
        this.database = [...filtered, plan];
    }

    public async findById(planId: PlanId): Promise<Plan | undefined> {
        return this.database.find((p) => p.id.equals(planId));
    }

    public async findBy(conditions: any): Promise<Plan[]> {
        throw new Error("Method not implemented.");
    }

    public async delete(planId: PlanId): Promise<void> {
        this.database = this.database.filter((p) => p.id.equals(planId));
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
