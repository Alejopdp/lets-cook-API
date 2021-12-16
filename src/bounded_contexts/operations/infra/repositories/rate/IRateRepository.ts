import { RecipeRating } from "../../../domain/recipeRating/RecipeRating";
import { CustomerId } from "../../../domain/customer/CustomerId";
import { Rate } from "../../../domain/rate/Rate";
import { RateId } from "../../../domain/rate/RateId";
import { RecipeRatingId } from "@src/bounded_contexts/operations/domain/recipeRating/RecipeRatingId";
import { Locale } from "@src/bounded_contexts/operations/domain/locale/Locale";

export interface IRateRepository {
    save(rate: RecipeRating | undefined): Promise<void>;
    findById(recipeRatingId: RecipeRatingId, locale: Locale): Promise<RecipeRating | undefined>;
    findAll(locale: Locale): Promise<RecipeRating[]>;
    findAllByCustomer(customerId: CustomerId, locale: Locale): Promise<RecipeRating[]>;
    updateMany(ratings: RecipeRating[]): Promise<void>;
    delete(recipeRatingId: RecipeRatingId): void;
}
