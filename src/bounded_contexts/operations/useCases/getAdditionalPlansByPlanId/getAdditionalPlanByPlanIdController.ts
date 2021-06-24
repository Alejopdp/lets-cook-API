import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetAdditionalPlansByPlanId } from "./getAdditionalPlansByPlanId";
import { GetAdditionalPlanByPlanIdDto } from "./getAdditionalPlanByPlanIdDto";

export class GetAdditionalPlansByPlanIdController extends BaseController {
    private _getAdditionalPlansByPlanId: GetAdditionalPlansByPlanId;

    constructor(getAdditionalPlanByPlanId: GetAdditionalPlansByPlanId) {
        super();
        this._getAdditionalPlansByPlanId = getAdditionalPlanByPlanId;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetAdditionalPlanByPlanIdDto = {
                planId: this.req.params.id,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.getAdditionalPlanByPlanId.execute(dto);

            return this.ok(this.res, result);
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
}
