import { BaseController } from "../../../../core/infra/BaseController";
import { GetActualWeekRecipes } from "./getActualWeekRecipes";
import { GetActualWeekRecipesPresenter } from "./getActualWeekRecipesPresenter";
import { GetActualWeekRecipesDto } from "./getActualWeekRecipesDto";
import { Locale } from "../../domain/locale/Locale";

export class GetActualWeekRecipesController extends BaseController {
    private _getActualWeekRecipes: GetActualWeekRecipes;
    private _getActualWeeRecipesPresenter: GetActualWeekRecipesPresenter;

    constructor(getActualWeekRecipes: GetActualWeekRecipes, getActualWeeRecipesPresenter: GetActualWeekRecipesPresenter) {
        super();
        this._getActualWeekRecipes = getActualWeekRecipes;
        this._getActualWeeRecipesPresenter = getActualWeeRecipesPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetActualWeekRecipesDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };
            const result = await this.getActualWeekRecipes.execute(dto);
            const presentedResult = await this.getActualWeeRecipesPresenter.present(result);

            return this.ok(this.res, presentedResult);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter GetActualWeekRecipes
     * @return {GetActualWeekRecipes}
     */

    public get getActualWeekRecipes(): GetActualWeekRecipes {
        return this._getActualWeekRecipes;
    }

    /**
     * Getter getActualWeeRecipesPresenter
     * @return {GetActualWeekRecipesPresenter}
     */
    public get getActualWeeRecipesPresenter(): GetActualWeekRecipesPresenter {
        return this._getActualWeeRecipesPresenter;
    }
}
