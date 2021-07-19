import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetRecipesByRestrictions } from "./getRecipesByRestrictions";
import { GetRecipesByRestrictionsDto } from "./getRecipesByRestrictionsDto";

export class GetRecipesByRestrictionsController extends BaseController {
    private _getRecipesByRestrictions: GetRecipesByRestrictions;

    constructor(
        getRecipesByRestrictions: GetRecipesByRestrictions,
    ) {
        super();
        this._getRecipesByRestrictions = getRecipesByRestrictions;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetRecipesByRestrictionsDto = {
                planId: this.req.body.planId,
                restrictionId: this.req.body.restrictionId
            };

            const result = await this.getRecipesByRestrictions.execute(dto);

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getAdditionalPlanList
     * @return {GetRecipesByRestrictions}
     */
    public get getRecipesByRestrictions(): GetRecipesByRestrictions {
        return this._getRecipesByRestrictions;
    }
}
