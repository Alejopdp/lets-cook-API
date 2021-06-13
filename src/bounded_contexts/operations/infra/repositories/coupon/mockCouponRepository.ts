import { Locale } from "../../../domain/locale/Locale";
import { Coupon } from "../../../domain/cupons/Cupon";
import { PlanType } from "../../../domain/plan/PlanType/PlanType";
import { ICouponRepository } from "./ICouponRepository";

export class MockCouponRepository implements ICouponRepository {
    private _database: Coupon[];

    constructor(database: Coupon[]) {
        this._database = database;
    }

    // findAdditionalPlanListById(ids: PlanId[], locale: Locale): Promise<Plan[]> {
    //     throw new Error("Method not implemented.");
    // }

    public async save(coupon: Coupon): Promise<void> {
        console.log("Repository", coupon)
        const filtered = this.database.filter((p) => !p.equals(coupon));
        this.database = [...filtered, coupon];
    }

    // public async findById(planId: PlanId): Promise<Coupon | undefined> {
    //     return this.database.find((p) => p.id.equals(planId));
    // }

    public async findAll(): Promise<Coupon[]> {
        return this.database;
    }

    // public async delete(planId: string): Promise<void> {
    //     this.database = this.database.filter((p) => !p.id.equals(planId));
    // }

    /**
     * Getter database
     * @return {Coupon[]}
     */
    public get database(): Coupon[] {
        return this._database;
    }

    /**
     * Setter database
     * @param {Coupon[]} value
     */
    public set database(value: Coupon[]) {
        this._database = value;
    }
}
