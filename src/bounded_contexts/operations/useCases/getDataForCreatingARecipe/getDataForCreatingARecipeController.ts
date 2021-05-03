import { BaseController } from "../../../../core/infra/BaseController";
import { GetDataForCreatingARecipe } from "./getDataForCreatingARecipe";

export class GetDataForCreatingARecipeController extends BaseController {
    private _getDataForCreatingARecipe: GetDataForCreatingARecipe;

    constructor(getDataForCreatingARecipe: GetDataForCreatingARecipe) {
        super();
        this._getDataForCreatingARecipe = getDataForCreatingARecipe;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const result = await this.getDataForCreatingARecipe.execute();

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {GetDataForCreatingARecipe}
     */
    public get getDataForCreatingARecipe(): GetDataForCreatingARecipe {
        return this._getDataForCreatingARecipe;
    }
}
