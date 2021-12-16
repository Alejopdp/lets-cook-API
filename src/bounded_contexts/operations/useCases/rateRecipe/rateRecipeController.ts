import { BaseController } from "../../../../core/infra/BaseController";
import { RateRecipe } from "./rateRecipe";
import { RateRecipeDto } from "./rateRecipeDto";

export class RateRecipeController extends BaseController {
    private _rateRecipe: RateRecipe;

    constructor(rateRecipe: RateRecipe) {
        super();
        this._rateRecipe = rateRecipe;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: RateRecipeDto = {
                recipeRatingId: this.req.params.recipeRatingId,
                rating: this.req.body.rating,
                comment: this.req.body.comment,
            };

            await this.rateRecipe.execute(dto);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter rateRecipe
     * @return {RateRecipe}
     */
    public get rateRecipe(): RateRecipe {
        return this._rateRecipe;
    }
}
