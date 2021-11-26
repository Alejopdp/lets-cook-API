import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetPlanAhorro } from "./getPlanAhorro";
import { GetPlanAhorroDto } from "./getPlanAhorroDto";
import { GetPlanAhorroPresenter } from "./getPlanAhorroPresenter";

export class GetPlanAhorroController extends BaseController {
    private _getPlanAhorro: GetPlanAhorro;
    private _getPlanAhorroPresenter: GetPlanAhorroPresenter;

    constructor(getPlanAhorro: GetPlanAhorro, getPlanAhorroPresenter: GetPlanAhorroPresenter) {
        super();
        this._getPlanAhorro = getPlanAhorro;
        this._getPlanAhorroPresenter = getPlanAhorroPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetPlanAhorroDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.getPlanAhorro.execute(dto);
            const presentedResult = await this.getPlanAhorroPresenter.present(result, dto.locale);

            return this.ok(this.res, presentedResult);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getPlanAhorro
     * @return {GetPlanAhorro}
     */
    public get getPlanAhorro(): GetPlanAhorro {
        return this._getPlanAhorro;
    }

    /**
     * Getter getPlanAhorroPresenter
     * @return {GetPlanAhorroPresenter}
     */
    public get getPlanAhorroPresenter(): GetPlanAhorroPresenter {
        return this._getPlanAhorroPresenter;
    }
}
