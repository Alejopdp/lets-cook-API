import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { PlanType } from "../../domain/plan/PlanType/PlanType";
import { UpdatePlan } from "./updatePlan";
import { UpdatePlanDto } from "./updatePlanDto";
import fs from "fs";
import { Locale } from "../../domain/locale/Locale";

export class UpdatePlanController extends BaseController {
    private _updatePlan: UpdatePlan;

    constructor(updatePlan: UpdatePlan) {
        super();
        this._updatePlan = updatePlan;
    }

    protected async executeImpl(): Promise<any> {
        try {
            var planImagePath = "";
            var planImage: ReadStream | undefined;
            var planImageFileName: string = "";
            var iconLinealPath = "";
            var iconLineal: ReadStream | undefined;
            var iconLinealFileName: string = "";
            var iconLinealColorPath = "";
            var iconLinealColor: ReadStream | undefined;
            var iconLinealColorFileName: string = "";

            if (this.req.file) {
                planImagePath = this.req.file.path;
                planImage = fs.createReadStream(planImagePath);
                planImageFileName = this.req.file.originalname;
            }

            const dto: UpdatePlanDto = {
                id: this.req.params.id,
                planName: this.req.body.name,
                planDescription: this.req.body.description,
                planSku: this.req.body.sku,
                isActive: JSON.parse(this.req.body.isActive),
                planImage,
                planImageFileName,
                availablePlanFrecuencies: JSON.parse(this.req.body.availablePlanFrecuencies),
                planType: (<any>PlanType)[this.req.body.type],
                hasRecipes: JSON.parse(this.req.body.hasRecipes),
                planVariants: JSON.parse(this.req.body.variants),
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
                additionalPlansIds: JSON.parse(this.req.body.additionalPlans),
                abilityToChooseRecipes: JSON.parse(this.req.body.abilityToChooseRecipes),
                planSlug: this.req.body.planSlug,
                iconLinealColorFileName: iconLinealColorFileName,
                iconLinealFileName: iconLinealFileName,
                iconLinealColorFile: iconLinealColor,
                iconLinealFile: iconLineal,
            };

            await this.updatePlan.execute(dto);

            if (planImagePath) {
                fs.unlinkSync(planImagePath);
            }

            if (iconLinealPath) {
                fs.unlinkSync(iconLinealPath);
            }

            if (iconLinealColorPath) {
                fs.unlinkSync(iconLinealColorPath);
            }

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
