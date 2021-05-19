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
                availableMonths: JSON.parse(this.req.body.availableMonths)
                    .map((month: string) => (<any>Month)[month])
                    .filter((month: Month) => month),
                backOfficeTags: JSON.parse(this.req.body.backOfficeTags),
                cookTime: this.req.body.cookDuration,
                difficultyLevel: (<any>RecipeDifficultyLevel)[this.req.body.difficultyLevel],
                imageTags: JSON.parse(this.req.body.imageTags),
                recipeImage,
                recipeImageExtension: path.extname(this.req.file.originalname),
                shortDescription: this.req.body.shortDescription,
                longDescription: this.req.body.longDescription,
                name: this.req.body.name,
                nutritionalInfo: [],
                availableWeeksIds: JSON.parse(this.req.body.availableWeeksIds).map((id: string) => parseInt(id)),
                sku: this.req.body.sku,
                weight: this.req.body.weight,
                planIds: JSON.parse(this.req.body.planIds),
                variants: JSON.parse(this.req.body.variants),
                tools: JSON.parse(this.req.body.tools),
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
