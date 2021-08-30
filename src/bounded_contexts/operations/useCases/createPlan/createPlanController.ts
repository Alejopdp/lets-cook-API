import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { CreatePlanDto } from "./createPlanDto";
import fs from "fs";
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
            //@ts-ignore
            if (!!!this.req.files["planImage"]) throw new Error("No has ingresado una imagen para el plan");
            //@ts-ignore
            if (!!!this.req.files["icon"]) throw new Error("No has ingresado un icono sin color para el plan");
            //@ts-ignore
            if (!!!this.req.files["iconWithColor"]) throw new Error("No has ingresado un icono con color para el plan");

            //@ts-ignore
            const imageFilesArray = this.req.files["planImage"];
            //@ts-ignore
            const iconFilesArray = this.req.files["icon"];
            //@ts-ignore
            const iconWithColorArray = this.req.files["iconWithColor"];

            if (imageFilesArray.length === 0) throw new Error("No ha ingresado una imagen para el plan");
            if (iconFilesArray.length === 0) throw new Error("No ha ingresado un icono para el plan");
            if (iconWithColorArray.length === 0) throw new Error("No ha ingresado un icono con color para el plan");

            const planImagePath = imageFilesArray[0].path;
            const planImage: ReadStream = fs.createReadStream(planImagePath);
            const iconPath = iconFilesArray[0].path;
            const icon: ReadStream = fs.createReadStream(iconPath);
            const iconWithColorPath = iconWithColorArray[0].path;
            const iconWithColor: ReadStream = fs.createReadStream(iconWithColorPath);

            const dto: CreatePlanDto = {
                planName: this.req.body.name,
                planDescription: this.req.body.description,
                planSku: this.req.body.sku,
                isActive: JSON.parse(this.req.body.isActive),
                planImage,
                planImageFileName: imageFilesArray[0].originalname,
                availablePlanFrecuencies: JSON.parse(this.req.body.availablePlanFrecuencies),
                planType: (<any>PlanType)[this.req.body.type],
                hasRecipes: JSON.parse(this.req.body.hasRecipes),
                planVariants: JSON.parse(this.req.body.variants),
                additionalPlansIds: JSON.parse(this.req.body.additionalPlans),
                planSlug: this.req.body.planSlug,
                abilityToChooseRecipes: JSON.parse(this.req.body.abilityToChooseRecipes),
                iconLinealFile: icon,
                iconLinealFileName: iconFilesArray[0].originalname,
                iconLinealColorFile: iconWithColor,
                iconLinealColorFileName: iconWithColorArray[0].originalname,
                locale: (<any>Locale)[this.req.query.locale as string],
            };

            await this.createPlan.execute(dto);

            fs.unlinkSync(planImagePath);
            fs.unlinkSync(iconPath);
            fs.unlinkSync(iconWithColorPath);

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
