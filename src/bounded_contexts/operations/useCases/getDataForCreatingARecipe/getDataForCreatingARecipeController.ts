import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetDataForCreatingARecipe } from "./getDataForCreatingARecipe";
import { GetDataForCreatingARecipeDto } from "./getDataForCreatingARecipeDto";

export class GetDataForCreatingARecipeController extends BaseController {
    private _getDataForCreatingARecipe: GetDataForCreatingARecipe;

    constructor(getDataForCreatingARecipe: GetDataForCreatingARecipe) {
        super();
        this._getDataForCreatingARecipe = getDataForCreatingARecipe;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetDataForCreatingARecipeDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };
            const result = await this.getDataForCreatingARecipe.execute(dto);

            return this.ok(this.res, result);
        } catch (error: any) {
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
