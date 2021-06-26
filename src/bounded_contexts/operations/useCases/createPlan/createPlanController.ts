import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { CreatePlanDto } from "./createPlanDto";
import fs from "fs";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { PlanType } from "../../domain/plan/PlanType/PlanType";
import { CreatePlan } from "./createPlan";
import { logger } from "../../../../../config";
import { Locale } from "../../domain/locale/Locale";

export class CreatePlanController extends BaseController {
    private _createPlan: CreatePlan;

    constructor(createPlan: CreatePlan) {
        super();
        this._createPlan = createPlan;
    }

    protected async executeImpl(): Promise<any> {
        try {
            if (!this.req.file) throw new Error("No ha ingresado una imagen para el plan");
            const planImagePath = this.req.file.path;
            const planImage: ReadStream = fs.createReadStream(planImagePath);

            const dto: CreatePlanDto = {
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
                additionalPlansIds: JSON.parse(this.req.body.additionalPlans),
                planSlug: this.req.body.planSlug,
                abilityToChooseRecipes: JSON.parse(this.req.body.abilityToChooseRecipes),
                //@ts-ignore
                iconLinealFile: "iconLineal",
                iconLinealFileName: "iconLineal",
                //@ts-ignore
                iconLinealColorFile: "iconLinealFile",
                iconLinealColorFileName: "iconLinealFile",
                locale: (<any>Locale)[this.req.query.locale as string],
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
}
