import { CustomerId } from "@src/bounded_contexts/operations/domain/customer/CustomerId";
import { Locale } from "@src/bounded_contexts/operations/domain/locale/Locale";
import { RecipeRating } from "@src/bounded_contexts/operations/domain/recipeRating/RecipeRating";
import { RecipeRatingId } from "@src/bounded_contexts/operations/domain/recipeRating/RecipeRatingId";
import { IRateRepository } from "./IRateRepository";
import { RecipeId } from "@src/bounded_contexts/operations/domain/recipe/RecipeId";

export class InMemoryRateRepository implements IRateRepository {

    private _rates: RecipeRating[] = [];


    constructor(rates: RecipeRating[]) {
        this._rates = rates;
    }
    findAverageRatingByRecipe(recipeId: RecipeId): Promise<number> {
        throw new Error("Method not implemented.");
    }

    public async save(rate: RecipeRating | undefined): Promise<void> {
        if (rate) {
            const index = this._rates.findIndex((r) => r.id.equals(rate.id));
            if (index !== -1) {
                this._rates[index] = rate;
            } else {
                this._rates.push(rate);
            }
        }
    }
    public async findById(recipeRatingId: RecipeRatingId, locale: Locale): Promise<RecipeRating | undefined> {
        return this._rates.find((rate) => rate.id.equals(recipeRatingId));
    }
    public async findAll(locale: Locale): Promise<RecipeRating[]> {
        return this._rates;
    }
    public async findAllByCustomer(customerId: CustomerId, locale: Locale): Promise<RecipeRating[]> {
        return this._rates.filter((rate) => rate.customerId.equals(customerId));
    }
    public async updateMany(ratings: RecipeRating[]): Promise<void> {
        ratings.forEach((rating) => this.save(rating));
    }
    public async delete(recipeRatingId: RecipeRatingId): Promise<void> {
        this._rates = this._rates.filter((rate) => !rate.id.equals(recipeRatingId));
    }


    /**
     * Getter rates
     * @return {RecipeRating[] }
     */
    public get rates(): RecipeRating[] {
        return this._rates;
    }

    /**
     * Setter rates
     * @param {RecipeRating[] } value
     */
    public set rates(value: RecipeRating[]) {
        this._rates = value;
    }

}