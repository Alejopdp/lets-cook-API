import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetRecipeFilters } from "./getRecipeFilters";
import { GetRecipeFiltersDto } from "./getRecipeFiltersDto";

export class GetRecipeFiltersControllers extends BaseController {
    private _getRecipeFilters: GetRecipeFilters;

    constructor(getRecipeFilters: GetRecipeFilters) {
        super();
        this._getRecipeFilters = getRecipeFilters;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetRecipeFiltersDto = {
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const result = await this.getRecipeFilters.execute(dto);

            return this.ok(this.res, result);
        } catch (error: any) {
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
