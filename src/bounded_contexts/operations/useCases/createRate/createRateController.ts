import { BaseController } from "../../../../core/infra/BaseController";
import { CreateRateDto } from "./createRateDto";
import { CreateRate } from "./createRate";
import { logger } from "../../../../../config";
import { Locale } from "../../domain/locale/Locale";

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
                recipe: this.req.body.recipe,
            };

            await this.createRate.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
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
