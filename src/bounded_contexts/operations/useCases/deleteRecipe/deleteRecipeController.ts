import { BaseController } from "../../../../core/infra/BaseController";
import { DeleteRecipe } from "./deleteRecipe";
import { DeleteRecipeDto } from "./deleteRecipeDto";

export class DeleteRecipeController extends BaseController {
    private _deleteRecipe: DeleteRecipe;

    constructor(deleteRecipe: DeleteRecipe) {
        super();
        this._deleteRecipe = deleteRecipe;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: DeleteRecipeDto = {
                recipeId: this.req.params.id,
            };

            await this.deleteRecipe.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter deleteRecipe
     * @return {DeleteRecipe}
     */
    public get deleteRecipe(): DeleteRecipe {
        return this._deleteRecipe;
    }
}
