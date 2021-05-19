import _ from "lodash";
import { Ingredient } from "../../domain/ingredient/ingredient";
import { RecipeVariant } from "../../domain/recipe/RecipeVariant/RecipeVariant";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/RecipeVariantRestriction";
import { RecipeVariantSku } from "../../domain/recipe/RecipeVariant/RecipeVariantSku";
import { IIngredientRepository } from "../../infra/repositories/ingredient/IIngredientRepository";
import { RecipeVariantCreatorDto } from "./recipeVariantCreatorDto";

export class RecipeVariantCreator {
    private _ingredientRepository: IIngredientRepository;

    constructor(ingredientRepository: IIngredientRepository) {
        this._ingredientRepository = ingredientRepository;
    }

    public async execute(dto: RecipeVariantCreatorDto): Promise<RecipeVariant[]> {
        const allIngredientsName: string[] = _.uniq(_.flatten(dto.variants.map((variant) => variant.ingredients)));
        const ingredients: Ingredient[] = await this.ingredientRepository.findAllByName(allIngredientsName);
        const variants: RecipeVariant[] = [];

        for (let v of dto.variants) {
            const variantIngredients: Ingredient[] = ingredients.filter((ingredient) =>
                v.ingredients.some((ingredientName) => ingredientName === ingredient.name)
            );
            const variantRestrictions: RecipeVariantRestriction[] = v.restrictions.map(
                (restriction) => (<any>RecipeVariantRestriction)[restriction]
            );

            const sku: RecipeVariantSku = new RecipeVariantSku(v.sku);

            variants.push(new RecipeVariant(variantIngredients, variantRestrictions, sku));
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
}
