import { BaseController } from "../../../../core/infra/BaseController";
import { GetRecipeFilters } from "./getRecipeFilters";

export class GetRecipeFiltersControllers extends BaseController {
    private _getRecipeFilters: GetRecipeFilters;

    constructor(getRecipeFilters: GetRecipeFilters) {
        super();
        this._getRecipeFilters = getRecipeFilters;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const result = await this.getRecipeFilters.execute();

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getRecipeFilters
     * @return {GetRecipeFilters}
     */
    public get getRecipeFilters(): GetRecipeFilters {
        return this._getRecipeFilters;
    }
}
