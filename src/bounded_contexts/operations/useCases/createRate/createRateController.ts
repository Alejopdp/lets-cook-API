import { createRate } from "./index";
import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { CreateRateDto } from "./createRateDto";
import fs from "fs";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { PlanType } from "../../domain/plan/PlanType/PlanType";
import { CreateRate } from "./createRate";
import { logger } from "../../../../../config";
import { Locale } from "../../domain/locale/Locale";
import { PlanId } from "../../domain/plan/PlanId";

export class CreateRateController extends BaseController {
    private _createRate: CreateRate;

    constructor(createRate: CreateRate) {
        super();
        this._createRate = createRate;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: CreateRateDto = {
                customer: this.req.body.customer,
                recipe: this.req.body.recipe
            };

            await this.createRate.execute(dto);

            // fs.unlinkSync(planImagePath);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter createRate
     * @return {CreateRate}
     */
    public get createRate(): CreateRate {
        return this._createRate;
    }
}
