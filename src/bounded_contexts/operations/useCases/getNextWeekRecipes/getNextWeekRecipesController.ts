import { BaseController } from "../../../../core/infra/BaseController";
import { GetNextWeekRecipes } from "./getNextWeekRecipes";
import { GetNextWeekRecipesPresenter } from "./getNextWeekRecipesPresenter";
import { GetNextWeekRecipesDto } from "./getNextWeekRecipesDto";
import { Locale } from "../../domain/locale/Locale";

export class GetNextWeekRecipesController extends BaseController {
    private _getNextWeekRecipes: GetNextWeekRecipes;
    private _getNextWeeRecipesPresenter: GetNextWeekRecipesPresenter;

    constructor(getNextWeekRecipes: GetNextWeekRecipes, getNextWeeRecipesPresenter: GetNextWeekRecipesPresenter) {
        super();
        this._getNextWeekRecipes = getNextWeekRecipes;
        this._getNextWeeRecipesPresenter = getNextWeeRecipesPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetNextWeekRecipesDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };
            const result = await this.getNextWeekRecipes.execute(dto);
            const presentedResult = await this.getNextWeeRecipesPresenter.present(result);

            return this.ok(this.res, presentedResult);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter GetNextWeekRecipes
     * @return {GetNextWeekRecipes}
     */

    public get getNextWeekRecipes(): GetNextWeekRecipes {
        return this._getNextWeekRecipes;
    }

    /**
     * Getter getNextWeeRecipesPresenter
     * @return {GetNextWeekRecipesPresenter}
     */
    public get getNextWeeRecipesPresenter(): GetNextWeekRecipesPresenter {
        return this._getNextWeeRecipesPresenter;
    }
}
