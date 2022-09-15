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
            if (!this.req.files || this.req.files.length === 0) throw new Error("No ha ingresado una imagen para la receta");
            const files: Express.Multer.File[] = Array.isArray(this.req.files) ? this.req.files : [];
            const recipeImagesPaths = files.map((file: any) => file.path);
            const recipeImages: { file: ReadStream; fileName: string }[] = files.map((file: any) => ({
                file: fs.createReadStream(file.path),
                fileName: file.originalname,
            }));

            const dto: CreateRecipeDto = {
                availableMonths: JSON.parse(this.req.body.availableMonths)
                    .map((month: string) => (<any>Month)[month])
                    .filter((month: Month) => month),
                backOfficeTags: JSON.parse(this.req.body.backOfficeTags),
                cookTime: this.req.body.cookDuration,
                difficultyLevel: (<any>RecipeDifficultyLevel)[this.req.body.difficultyLevel],
                imageTags: JSON.parse(this.req.body.imageTags),
                recipeImages,
                // recipeImageExtension: path.extname(this.req.file.originalname),
                shortDescription: this.req.body.shortDescription,
                longDescription: this.req.body.longDescription,
                name: this.req.body.name,
                nutritionalInfo: JSON.parse(this.req.body.nutritionalInfo),
                availableWeeksIds: JSON.parse(this.req.body.availableWeeksIds),
                sku: this.req.body.sku,
                weight: this.req.body.weight,
                planIds: JSON.parse(this.req.body.planIds),
                variants: JSON.parse(this.req.body.variants),
                tools: JSON.parse(this.req.body.tools),
            };

            await this.createRecipe.execute(dto);

            recipeImagesPaths.forEach((path: string) => {
                fs.unlinkSync(path);
            });
            // fs.unlinkSync(recipeImagePath);

            return this.ok(this.res);
        } catch (error: any) {
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
