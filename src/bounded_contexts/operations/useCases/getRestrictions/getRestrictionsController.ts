import { BaseController } from "../../../../core/infra/BaseController";
import { GetRestrictions } from "./getRestrictions";
import { GetRestrictionsPresenter } from "./getRestrictionsPresenter";

export class GetRestrictionsController extends BaseController {
    private _getRestrictions: GetRestrictions;
    private _getRestrictionsPresenter: GetRestrictionsPresenter;

    constructor(getRestrictions: GetRestrictions, getRestrictionsPresenter: GetRestrictionsPresenter) {
        super();
        this._getRestrictions = getRestrictions;
        this._getRestrictionsPresenter = getRestrictionsPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const result = await this.getRestrictions.execute();
            const presented = await this.getRestrictionsPresenter.present(result);

            return this.ok(this.res, presented);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {GetRestrictions}
     */
    public get getRestrictions(): GetRestrictions {
        return this._getRestrictions;
    }

    /**
     * Getter GetRestrictionsPresenter
     * @return {GetRestrictionsPresenter}
     */
    public get getRestrictionsPresenter(): GetRestrictionsPresenter {
        return this._getRestrictionsPresenter;
    }
}
