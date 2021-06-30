import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetAdditionalPlansByPlanId } from "./getAdditionalPlansByPlanId";
import { GetAdditionalPlanByPlanIdDto } from "./getAdditionalPlanByPlanIdDto";
import { GetAdditionalPlansByPlanIdPresenter } from "./getAdditionalPlansByPlanIdPresenter";

export class GetAdditionalPlansByPlanIdController extends BaseController {
    private _getAdditionalPlansByPlanId: GetAdditionalPlansByPlanId;
    private _getAdditionalPlansByPlanIdPresenter: GetAdditionalPlansByPlanIdPresenter;

    constructor(
        getAdditionalPlanByPlanId: GetAdditionalPlansByPlanId,
        getAdditionalPlansByPlanIdPresenter: GetAdditionalPlansByPlanIdPresenter
    ) {
        super();
        this._getAdditionalPlansByPlanId = getAdditionalPlanByPlanId;
        this._getAdditionalPlansByPlanIdPresenter = getAdditionalPlansByPlanIdPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetAdditionalPlanByPlanIdDto = {
                planId: this.req.params.id,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.getAdditionalPlanByPlanId.execute(dto);
            const presentedResult = await this.getAdditionalPlansByPlanIdPresenter.present(result);

            return this.ok(this.res, presentedResult);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getAdditionalPlanByPlanId
     * @return {GetAdditionalPlansByPlanId}
     */
    public get getAdditionalPlanByPlanId(): GetAdditionalPlansByPlanId {
        return this._getAdditionalPlansByPlanId;
    }

    /**
     * Getter getAdditionalPlansByPlanId
     * @return {GetAdditionalPlansByPlanId}
     */
    public get getAdditionalPlansByPlanId(): GetAdditionalPlansByPlanId {
        return this._getAdditionalPlansByPlanId;
    }

    /**
     * Getter getAdditionalPlansByPlanIdPresenter
     * @return {GetAdditionalPlansByPlanIdPresenter}
     */
    public get getAdditionalPlansByPlanIdPresenter(): GetAdditionalPlansByPlanIdPresenter {
        return this._getAdditionalPlansByPlanIdPresenter;
    }
}
