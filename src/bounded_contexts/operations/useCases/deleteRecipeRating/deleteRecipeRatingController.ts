import { BaseController } from "../../../../core/infra/BaseController";
import { DeleteRecipeRating } from "./deleteRecipeRating";
import { DeleteRecipeRatingDto } from "./deleteRecipeRatingDto";

export class DeleteRecipeRatingController extends BaseController {
    private _deleteRecipeRating: DeleteRecipeRating;

    constructor(deleteRecipeRating: DeleteRecipeRating) {
        super();
        this._deleteRecipeRating = deleteRecipeRating;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: DeleteRecipeRatingDto = {
                recipeRatingId: this.req.params.recipeRatingId,
            };

            // await this.deleteRecipeRating.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter deleteRecipeRating
     * @return {DeleteRecipeRating}
     */
    public get deleteRecipeRating(): DeleteRecipeRating {
        return this._deleteRecipeRating;
    }
}
