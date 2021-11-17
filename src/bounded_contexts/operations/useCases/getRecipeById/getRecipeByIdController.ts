import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetRecipeById } from "./getRecipeById";
import { GetRecipeByIdDto } from "./getRecipeByIdDto";

export class GetRecipeByIdController extends BaseController {
    private _getRecipeById: GetRecipeById;

    constructor(getRecipeById: GetRecipeById) {
        super();
        this._getRecipeById = getRecipeById;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetRecipeByIdDto = {
                recipeId: this.req.params.id,
                locale: (<any>Locale)[(this.req.query.locale as string) || Locale.es],
            };
            const result = await this.getRecipeById.execute(dto);

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter getRecipeById
     * @return {GetRecipeById}
     */
    public get getRecipeById(): GetRecipeById {
        return this._getRecipeById;
    }
}
