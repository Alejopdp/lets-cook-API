import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { UpdateRecipe } from "./updateRecipe";
import { UpdateRecipeDto } from "./updateRecipeDto";
import fs from "fs";
import path from "path";

export class UpdateRecipeController extends BaseController {
    private _updateRecipe: UpdateRecipe;

    constructor(updateRecipe: UpdateRecipe) {
        super();
        this._updateRecipe = updateRecipe;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const recipeImagePath = this.req.file.path;
            const recipeImage: ReadStream = fs.createReadStream(recipeImagePath);

            const dto: UpdateRecipeDto = {
                recipeId: parseInt(this.req.params.id),
                availableMonths: this.req.body.availableMonths.map((month: string) => (<any>Month)[month]).filter((month: Month) => month),
                backOfficeTags: this.req.body.backOfficeTags,
                cookTime: this.req.body.cookTime,
                difficultyLevel: (<any>RecipeDifficultyLevel)[this.req.body.difficultyLevel],
                imageTags: this.req.body.imageTags,
                recipeImage,
                recipeImageExtension: path.extname(this.req.file.originalname),
                shortDescription: this.req.body.shortDescription,
                longDescription: this.req.body.longDescription,
                name: this.req.body.name,
                nutritionalInfo: [],
                relatedPlans: this.req.body.relatedPlans,
                sku: this.req.body.sku,
                weight: this.req.body.weight,
            };

            await this.updateRecipe.execute(dto);

            fs.unlinkSync(recipeImagePath);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter UpdateRecipe
     * @return {UpdateRecipe}
     */
    public get updateRecipe(): UpdateRecipe {
        return this._updateRecipe;
    }
}
