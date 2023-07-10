import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { UpdateRecipe } from "./updateRecipe";
import { UpdateRecipeDto } from "./updateRecipeDto";
import fs from "fs";
import path from "path";
import { Locale } from "../../domain/locale/Locale";

export class UpdateRecipeController extends BaseController {
    private _updateRecipe: UpdateRecipe;

    constructor(updateRecipe: UpdateRecipe) {
        super();
        this._updateRecipe = updateRecipe;
    }

    protected async executeImpl(): Promise<any> {
        try {
            if (!this.req.files) throw new Error("No ha ingresado una imagen para la receta");

            const files: Express.Multer.File[] = Array.isArray(this.req.files) ? this.req.files : [];
            if (files.length === 0) throw new Error("No ha ingresado una imagen para la receta");

            const recipeImagesPaths = files.map((file: any) => file.path);
            const recipeImages: { file: ReadStream; fileName: string }[] = files.map((file: any) => ({
                file: fs.createReadStream(file.path),
                fileName: file.originalname,
            }));
            const dto: UpdateRecipeDto = {
                recipeId: this.req.params.id,
                availableMonths: JSON.parse(this.req.body.availableMonths)
                    .map((month: string) => (<any>Month)[month])
                    .filter((month: Month) => month),
                backOfficeTags: JSON.parse(this.req.body.backOfficeTags),
                cookTime: this.req.body.cookDuration,
                difficultyLevel: (<any>RecipeDifficultyLevel)[this.req.body.difficultyLevel],
                imageTags: JSON.parse(this.req.body.imageTags),
                recipeImages: Array.isArray(recipeImages) ? recipeImages : [],
                shortDescription: this.req.body.shortDescription,
                longDescription: this.req.body.longDescription,
                name: this.req.body.name,
                nutritionalInfo: JSON.parse(this.req.body.nutritionalInfo),
                relatedPlans: JSON.parse(this.req.body.planIds),
                sku: this.req.body.sku,
                weight: this.req.body.weight,
                tools: JSON.parse(this.req.body.tools),
                variants: JSON.parse(this.req.body.variants),
                availableWeeksIds: JSON.parse(this.req.body.availableWeeksIds),
                orderPriority: this.req.body.orderPriority,
                locale: (<any>Locale)[(this.req.query.locale as string) || "es"],
            };

            await this.updateRecipe.execute(dto);

            recipeImagesPaths.forEach((path: string) => {
                fs.unlinkSync(path);
            });

            return this.ok(this.res);
        } catch (error: any) {
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
