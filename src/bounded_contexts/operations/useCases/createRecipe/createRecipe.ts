import { IStorageService } from "../../application/storageService/IStorageService";
import { Month } from "../../domain/recipe/Months";
import { Recipe } from "../../domain/recipe/Recipe";
import { RecipeCookDuration } from "../../domain/recipe/RecipeGeneralData/RecipeCookDuration";
import { RecipeDescription } from "../../domain/recipe/RecipeGeneralData/RecipeDescription";
import { RecipeGeneralData } from "../../domain/recipe/RecipeGeneralData/RecipeGeneralData";
import { RecipeSku } from "../../domain/recipe/RecipeGeneralData/RecipeSku";
import { RecipeWeight } from "../../domain/recipe/RecipeGeneralData/RecipeWeight";
import { WeightUnit } from "../../domain/recipe/RecipeGeneralData/WeightUnit";
import { RecipeNutritionalData } from "../../domain/recipe/RecipeNutritionalData/RecipeNutritionalData";
import { RecipeTag } from "../../domain/recipe/RecipeTag";
import { Week } from "../../domain/week/Week";
import { WeekId } from "../../domain/week/WeekId";
import { IRecipeRepository } from "../../infra/repositories/recipe/IRecipeRepository";
import { IWeekRepository } from "../../infra/repositories/week/IWeekRepository";
import { CreateRecipeDto } from "./createRecipeDto";

export class CreateRecipe {
    private _recipeRepository: IRecipeRepository;
    private _storageService: IStorageService;
    private _weekRepository: IWeekRepository;

    constructor(recipeRepository: IRecipeRepository, storageService: IStorageService, weekRepository: IWeekRepository) {
        this._recipeRepository = recipeRepository;
        this._storageService = storageService;
        this._weekRepository = weekRepository;
    }

    public async execute(dto: CreateRecipeDto): Promise<void> {
        const imageUrl: string = await this.storageService.saveRecipeImage(dto.name, dto.recipeImageExtension, dto.recipeImage);
        const recipeSku: RecipeSku = new RecipeSku(dto.sku);
        const recipeDescription: RecipeDescription = new RecipeDescription(dto.shortDescription, dto.longDescription);
        const recipeCookTime: RecipeCookDuration = new RecipeCookDuration(dto.cookTime);
        const recipeWeight: RecipeWeight = new RecipeWeight(dto.weight, WeightUnit.Gram);
        const recipeGeneralData: RecipeGeneralData = new RecipeGeneralData(
            dto.name,
            recipeDescription,
            recipeCookTime,
            dto.difficultyLevel,
            recipeWeight,
            recipeSku,
            imageUrl
        );
        const recipeImageTags: RecipeTag[] = dto.imageTags.map((tag: string) => new RecipeTag(tag));
        const recipeBackOfficeTags: RecipeTag[] = dto.backOfficeTags.map((tag: string) => new RecipeTag(tag));
        const recipeNutritionalData: RecipeNutritionalData = new RecipeNutritionalData([]); // TO DO: Get from DTO
        const weeksIds: WeekId[] = dto.availableWeeksIds.map((weekId: number | string) => new WeekId(weekId));
        const weeks: Week[] = await this.weekRepository.findAllById(weeksIds);

        const recipe: Recipe = new Recipe(
            recipeGeneralData,
            [],
            recipeImageTags,
            recipeBackOfficeTags,
            recipeNutritionalData,
            weeks,
            dto.availableMonths
        );

        await this.recipeRepository.save(recipe);
    }

    /**
     * Getter recipeRepository
     * @return {IRecipeRepository}
     */
    public get recipeRepository(): IRecipeRepository {
        return this._recipeRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }

    /**
     * Getter weekRepository
     * @return {IWeekRepository}
     */
    public get weekRepository(): IWeekRepository {
        return this._weekRepository;
    }
}
