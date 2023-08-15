import { RecipeRating } from "../../../domain/recipeRating/RecipeRating";
import { CustomerId } from "../../../domain/customer/CustomerId";
import { RecipeRatingId } from "@src/bounded_contexts/operations/domain/recipeRating/RecipeRatingId";
import { Locale } from "@src/bounded_contexts/operations/domain/locale/Locale";
import { RecipeId } from "@src/bounded_contexts/operations/domain/recipe/RecipeId";

export interface IRateRepository {
    save(rate: RecipeRating | undefined): Promise<void>;
    findBy(conditions: any, locale: Locale): Promise<RecipeRating[]>
    findById(recipeRatingId: RecipeRatingId, locale: Locale): Promise<RecipeRating | undefined>;
    findAll(locale: Locale): Promise<RecipeRating[]>;
    findAllByCustomer(customerId: CustomerId, locale: Locale): Promise<RecipeRating[]>;
    findAverageRatingByRecipe(recipeId: RecipeId): Promise<number>;
    updateMany(ratings: RecipeRating[]): Promise<void>;
    delete(recipeRatingId: RecipeRatingId): void;
}
