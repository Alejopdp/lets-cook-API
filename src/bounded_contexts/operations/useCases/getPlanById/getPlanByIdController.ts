import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetPlanById } from "./getPlanById";
import { GetPlanByIdDto } from "./getPlanByIdDto";

export class GetPlanByIdController extends BaseController {
    private _getPlanById: GetPlanById;

    constructor(getPlanById: GetPlanById) {
        super();
        this._getPlanById = getPlanById;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetPlanByIdDto = {
                planId: this.req.params.id,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.getPlanById.execute(dto);

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getPlanById
     * @return {GetPlanById}
     */
    public get getPlanById(): GetPlanById {
        return this._getPlanById;
    }
}
