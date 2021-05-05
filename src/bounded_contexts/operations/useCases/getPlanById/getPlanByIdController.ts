import { BaseController } from "../../../../core/infra/BaseController";
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
                planId: parseInt(this.req.params.id),
            };

            const result = await this.getPlanById.execute(dto);

            this.ok(this.res, result);
        } catch (error) {
            return error.response;
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
