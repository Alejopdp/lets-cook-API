import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetPlanById } from "./getPlanById";
import { GetPlanByIdDto } from "./getPlanByIdDto";
import { GetPlanByIdPresenter } from "./getPlanByIdPresenter";

export class GetPlanByIdController extends BaseController {
    private _getPlanById: GetPlanById;
    private _getPlanByIdPresenter: GetPlanByIdPresenter;

    constructor(getPlanById: GetPlanById, getPlanByIdPresenter: GetPlanByIdPresenter) {
        super();
        this._getPlanById = getPlanById;
        this._getPlanByIdPresenter = getPlanByIdPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetPlanByIdDto = {
                planId: this.req.params.id,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.getPlanById.execute(dto);
            const presentedResult = await this.getPlanByIdPresenter.present(result);

            return this.ok(this.res, presentedResult);
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

    /**
     * Getter getPlanByIdPresenter
     * @return {GetPlanByIdPresenter}
     */
    public get getPlanByIdPresenter(): GetPlanByIdPresenter {
        return this._getPlanByIdPresenter;
    }
}
