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
            var recipeImagePath = "";
            var recipeImage: ReadStream | undefined;
            var recipeImageFileName: string = "";

            if (this.req.file) {
                recipeImagePath = this.req.file.path;
                recipeImage = fs.createReadStream(recipeImagePath);
                recipeImageFileName = this.req.file.originalname;
            }

            const dto: UpdateRecipeDto = {
                recipeId: this.req.params.id,
                availableMonths: JSON.parse(this.req.body.availableMonths)
                    .map((month: string) => (<any>Month)[month])
                    .filter((month: Month) => month),
                backOfficeTags: JSON.parse(this.req.body.backOfficeTags),
                cookTime: this.req.body.cookDuration,
                difficultyLevel: (<any>RecipeDifficultyLevel)[this.req.body.difficultyLevel],
                imageTags: JSON.parse(this.req.body.imageTags),
                recipeImage,
                recipeImageExtension: recipeImageFileName,
                shortDescription: this.req.body.shortDescription,
                longDescription: this.req.body.longDescription,
                name: this.req.body.name,
                nutritionalInfo: [],
                relatedPlans: JSON.parse(this.req.body.planIds),
                sku: this.req.body.sku,
                weight: this.req.body.weight,
                tools: JSON.parse(this.req.body.tools),
                variants: JSON.parse(this.req.body.variants),
                availableWeeksIds: JSON.parse(this.req.body.availableWeeksIds).map((id: string) => parseInt(id)),
            };

            await this.updateRecipe.execute(dto);

            if (recipeImagePath) {
                fs.unlinkSync(recipeImagePath);
            }

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
