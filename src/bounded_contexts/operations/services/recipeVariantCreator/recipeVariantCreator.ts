import _ from "lodash";
import { logger } from "../../../../../config";
import { Ingredient } from "../../domain/ingredient/ingredient";
import { RecipeVariant } from "../../domain/recipe/RecipeVariant/RecipeVariant";
import { RecipeRestrictionId } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeVariantSku } from "../../domain/recipe/RecipeVariant/RecipeVariantSku";
import { IIngredientRepository } from "../../infra/repositories/ingredient/IIngredientRepository";
import { IRecipeRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction/IRecipeRestrictionRepository";
import { RecipeVariantCreatorDto } from "./recipeVariantCreatorDto";

export class RecipeVariantCreator {
    private _ingredientRepository: IIngredientRepository;
    private _recipeRestrictionRepository: IRecipeRestrictionRepository;

    constructor(ingredientRepository: IIngredientRepository, recipeRestrictionRepository: IRecipeRestrictionRepository) {
        this._ingredientRepository = ingredientRepository;
        this._recipeRestrictionRepository = recipeRestrictionRepository;
    }

    public async execute(dto: RecipeVariantCreatorDto): Promise<RecipeVariant[]> {
        const allIngredientsName: string[] = _.uniq(_.flatten(dto.variants.map((variant) => variant.ingredients)));
        const restrictions: RecipeVariantRestriction[] = await this.recipeRestrictionRepository.findAll();
        const ingredients: Ingredient[] = await this.ingredientRepository.findAllByName(allIngredientsName);
        const variants: RecipeVariant[] = [];

        for (let v of dto.variants) {
            const variantIngredients: Ingredient[] = ingredients.filter((ingredient) =>
                v.ingredients.some((ingredientName) => ingredientName === ingredient.name)
            );
            const variantRestriction: RecipeVariantRestriction | undefined = restrictions.find((r) =>
                v.restrictions.some((value) => r.value === value)
            );
            const sku: RecipeVariantSku = new RecipeVariantSku(v.sku);

            variants.push(new RecipeVariant(variantIngredients, variantRestriction, sku));
        }

        return variants;
    }

    /**
     * Getter ingredientRepository
     * @return {IIngredientRepository}
     */
    public get ingredientRepository(): IIngredientRepository {
        return this._ingredientRepository;
    }

    /**
     * Getter recipeRestrictionRepository
     * @return {IRecipeRestrictionRepository}
     */
    public get recipeRestrictionRepository(): IRecipeRestrictionRepository {
        return this._recipeRestrictionRepository;
    }
}
