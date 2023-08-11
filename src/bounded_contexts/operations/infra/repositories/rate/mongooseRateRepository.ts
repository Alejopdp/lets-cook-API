import { CustomerId } from "../../../domain/customer/CustomerId";
import { RateId } from "../../../domain/rate/RateId";
import { IRateRepository } from "./IRateRepository";
import { Rate as MongooseRate } from "../../../../../infraestructure/mongoose/models";
import { rateMapper } from "../../../mappers";
import { RecipeRating } from "../../../domain/recipeRating/RecipeRating";
import { RecipeRatingId } from "../../../domain/recipeRating/RecipeRatingId";
import { Locale } from "../../../domain/locale/Locale";
import { RecipeId } from "../../../domain/recipe/RecipeId";
export class MongooseRateRepository implements IRateRepository {
    public async save(rate: RecipeRating): Promise<void> {
        const rateDb = rateMapper.toPersistence(rate);
        if (await MongooseRate.exists({ _id: rate.id.value })) {
            await MongooseRate.updateOne({ _id: rate.id.value }, rateDb);
        } else {
            await MongooseRate.create(rateDb);
        }
    }

    public async findById(rateId: RecipeRatingId, locale: Locale): Promise<RecipeRating | undefined> {
        const rateDb = await MongooseRate.findById(rateId.toString(), { deletionFlag: false }).populate({
            path: "recipe",
            populate: { path: "recipeVariants", populate: [{ path: "restriction" }, { path: "ingredients" }] },
        });

        return rateDb ? rateMapper.toDomain(rateDb, locale) : undefined;
    }

    public async findAll(locale: Locale): Promise<RecipeRating[]> {
        return await this.findBy({ rating: { $gt: 0 } }, locale);
    }

    public async findAllByCustomer(customerId: CustomerId, locale: Locale): Promise<RecipeRating[]> {
        const ratesDb = await MongooseRate.find({ customer: customerId.toString() }).populate({
            path: "recipe",
            populate: { path: "recipeVariants", populate: [{ path: "restriction" }, { path: "ingredients" }] },
        });

        return ratesDb.map((rate: any) => rateMapper.toDomain(rate, locale));
    }

    public async findBy(conditions: any, locale: Locale): Promise<RecipeRating[]> {
        const rateDb = await MongooseRate.find({ ...conditions, deletionFlag: false }).populate({
            path: "recipe",
            populate: { path: "recipeVariants", populate: [{ path: "restriction" }, { path: "ingredients" }] },
        }).lean()

        return rateDb.map((raw: any) => rateMapper.toDomain(raw, locale));
    }

    public async findAverageRatingByRecipe(recipeId: RecipeId): Promise<number> {
        const ratesDb = await MongooseRate.find({ recipe: recipeId.toString() }).populate({
            path: "recipe",
            populate: { path: "recipeVariants", populate: [{ path: "restriction" }, { path: "ingredients" }] },
        });
        if (ratesDb.length === 0) return 0;
        const rates = ratesDb.map((rate) => rateMapper.toDomain(rate, Locale.es));
        const total = rates.reduce((acc, rate) => acc + (rate.rating ?? 0), 0);

        return total / rates.length;
    }

    public async updateMany(ratings: RecipeRating[]): Promise<void> {
        for (let rating of ratings) {
            // const rateDb = rateMapper.toPersistence(rating);
            await this.save(rating);
            // await MongooseRate.updateOne({ _id: rating.id.toString() }, rateDb, { upsert: true });
        }
    }

    public async delete(rateId: RateId): Promise<void> {
        await MongooseRate.deleteOne({ _id: rateId.value });
    }
}
