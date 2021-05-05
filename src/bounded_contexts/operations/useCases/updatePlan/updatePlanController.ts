import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { PlanType } from "../../domain/plan/PlanType/PlanType";
import { UpdatePlan } from "./updatePlan";
import { UpdatePlanDto } from "./updatePlanDto";
import fs from "fs";

export class UpdatePlanController extends BaseController {
    private _updatePlan: UpdatePlan;

    constructor(updatePlan: UpdatePlan) {
        super();
        this._updatePlan = updatePlan;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const planImagePath = this.req.file.path;
            const planImage: ReadStream = fs.createReadStream(planImagePath);

            const dto: UpdatePlanDto = {
                id: parseInt(this.req.params.id),
                planName: this.req.body.name,
                planDescription: this.req.body.description,
                planSku: this.req.body.sku,
                isActive: JSON.parse(this.req.body.isActive),
                planImage,
                planImageFileName: this.req.file.originalname,
                availablePlanFrecuencies: JSON.parse(this.req.body.availablePlanFrecuencies)
                    .map((freq: string) => (<any>PlanFrequency)[freq.toString()])
                    .filter((freq: PlanFrequency) => freq),
                planType: (<any>PlanType)[this.req.body.type],
                hasRecipes: JSON.parse(this.req.body.hasRecipes),
                planVariants: JSON.parse(this.req.body.variants),
            };

            await this.updatePlan.execute(dto);

            fs.unlinkSync(planImagePath);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter updatePlan
     * @return {UpdatePlan}
     */
    public get updatePlan(): UpdatePlan {
        return this._updatePlan;
    }
}
