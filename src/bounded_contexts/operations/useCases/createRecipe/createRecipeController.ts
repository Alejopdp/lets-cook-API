import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { CreateRecipe } from "./createRecipe";
import { CreateRecipeDto } from "./createRecipeDto";
import fs from "fs";
import path from "path";

export class CreateRecipeController extends BaseController {
    private _createRecipe: CreateRecipe;

    constructor(createRecipe: CreateRecipe) {
        super();
        this._createRecipe = createRecipe;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const recipeImagePath = this.req.file.path;
            const recipeImage: ReadStream = fs.createReadStream(recipeImagePath);

            const dto: CreateRecipeDto = {
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

            await this.createRecipe.execute(dto);

            fs.unlinkSync(recipeImagePath);

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter createRecipe
     * @return {CreateRecipe}
     */
    public get createRecipe(): CreateRecipe {
        return this._createRecipe;
    }
}
