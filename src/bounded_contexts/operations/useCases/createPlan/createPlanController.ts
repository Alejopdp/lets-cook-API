import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { CreatePlanDto } from "./createPlanDto";
import fs from "fs";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { PlanType } from "../../domain/plan/PlanType/PlanType";
import { CreatePlan } from "./createPlan";
import { PlanVariant } from "../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantWithRecipe } from "../../domain/plan/PlanVariant/PlanVariantWithRecipes";
import { PlanSku } from "../../domain/plan/PlanSku";
import { logger } from "../../../../../config";

export class CreatePlanController extends BaseController {
    private _createPlan: CreatePlan;

    constructor(createPlan: CreatePlan) {
        super();
        this._createPlan = createPlan;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const planImagePath = this.req.file.path;
            const planImage: ReadStream = fs.createReadStream(planImagePath);

            const dto: CreatePlanDto = {
                planName: this.req.body.name,
                planDescription: this.req.body.description,
                planSku: this.req.body.sku,
                isActive: this.req.body.isActive === "Active",
                planImage,
                planImageFileName: this.req.file.originalname,
                availablePlanFrecuencies: this.req.body.frequencies
                    .map((freq: string) => (<any>PlanFrequency)[freq.toString()])
                    .filter((freq: PlanFrequency) => freq),
                planType: (<any>PlanType)[this.req.body.planType],
                hasRecipes: this.req.body.hasRecipes,
                planVariants: [new PlanVariantWithRecipe(3, 2, new PlanSku("PLVGG"), "Variante 1", 30, 20, [])],
                // planVariants: this.req.body.planVariants
            };

            await this.createPlan.execute(dto);

            fs.unlinkSync(planImagePath);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter createPlan
     * @return {CreatePlan}
     */
    public get createPlan(): CreatePlan {
        return this._createPlan;
    }

    /**
     * Setter createPlan
     * @param {CreatePlan} value
     */
    public set createPlan(value: CreatePlan) {
        this._createPlan = value;
    }
}
