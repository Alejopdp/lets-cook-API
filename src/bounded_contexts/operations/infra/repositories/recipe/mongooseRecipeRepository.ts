import { Recipe } from "../../../domain/recipe/Recipe";
import { Recipe as RecipeModel } from "../../../../../infraestructure/mongoose/models";
import { RecipeId } from "../../../domain/recipe/RecipeId";
import { WeekId } from "../../../domain/week/WeekId";
import { RecipeTag } from "../../../domain/recipe/RecipeTag";
import { IRecipeRepository } from "./IRecipeRepository";
import _ from "lodash";
import { logger } from "../../../../../../config";
import { recipeMapper } from "../../../mappers/recipeMapper";
import { Order } from "../../../domain/order/Order";
import { RecipeRestrictionId } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { RecipeVariantSku } from "@src/bounded_contexts/operations/domain/recipe/RecipeVariant/RecipeVariantSku";
import { Locale } from "../../../domain/locale/Locale";

export class MongooseRecipeRepository implements IRecipeRepository {
    public async save(recipe: Recipe, locale: Locale = Locale.es): Promise<void> {
        const recipeDb = recipeMapper.toPersistence(recipe, locale);

        if (await RecipeModel.exists({ _id: recipe.id.value })) {
            const auxRecipeGeneralData = { ...recipeDb.recipeGeneralData };
            delete recipeDb.recipeGeneralData;
            const nameWithLocaleKey = `recipeGeneralData.name.${locale}`;
            const shortDescriptionWithLocaleKey = `recipeGeneralData.recipeDescription.shortDescription.${locale}`;
            const longDescriptionWithLocaleKey = `recipeGeneralData.recipeDescription.longDescription.${locale}`;

            await RecipeModel.updateOne(
                { _id: recipe.id.value },
                {
                    ...recipeDb,
                    $set: {
                        ...auxRecipeGeneralData,
                        [nameWithLocaleKey]: auxRecipeGeneralData.name[locale],
                        [shortDescriptionWithLocaleKey]: auxRecipeGeneralData.recipeDescription.shortDescription[locale],
                        [longDescriptionWithLocaleKey]: auxRecipeGeneralData.recipeDescription.longDescription[locale],
                        recipeCookDuration: {
                            timeValue: auxRecipeGeneralData.recipeCookDuration.timeValue,
                            timeUnit: auxRecipeGeneralData.recipeCookDuration.timeUnit,
                        },
                        recipeWeight: {
                            weightValue: auxRecipeGeneralData.recipeWeight.weightValue,
                            weightUnit: auxRecipeGeneralData.recipeWeight.weightUnit,
                        },
                        sku: auxRecipeGeneralData.sku,
                        imagesUrls: auxRecipeGeneralData.imagesUrls,
                        difficultyLevel: auxRecipeGeneralData.difficultyLevel,
                    },
                }
            );
        } else {
            await RecipeModel.create(recipeDb);
        }
    }

    public async bulkSave(recipes: Recipe[]): Promise<void> {
        const recipesToSave = recipes.map((recipe) => recipeMapper.toPersistence(recipe));

        await RecipeModel.insertMany(recipesToSave);
    }

    public async findAll(locale: Locale = Locale.es): Promise<Recipe[]> {
        return await this.findBy({}, locale);
    }

    public async findByIdList(recipesIds: RecipeId[], locale: Locale = Locale.es): Promise<Recipe[]> {
        const recipes = await this.findBy({ _id: recipesIds.map((id) => id.value) }, locale);

        return recipes;
    }

    public async findByRecipeVariantSkuList(recipeVariantSkus: RecipeVariantSku[], locale: Locale = Locale.es): Promise<Recipe[]> {
        return await this.findBy({ "recipeVariants.sku": recipeVariantSkus.map((sku) => sku.code) }, locale);
    }

    public async findByWeekId(weekId: WeekId, locale: Locale = Locale.es): Promise<Recipe[]> {
        return await this.findBy({ availableWeeks: weekId }, locale);
    }

    public async findAllBackOfficeTags(locale: Locale = Locale.es): Promise<RecipeTag[]> {
        const recipes: Recipe[] = await this.findAll(locale);

        return _.uniqBy(_.flatten(recipes.map((recipe) => recipe.recipeBackOfficeTags)), (tag) => tag.name);
    }

    public async findById(recipeId: RecipeId, locale: Locale = Locale.es): Promise<Recipe | undefined> {
        const recipeDb = await RecipeModel.findById(recipeId.value)
            .populate("availableWeeks")
            .populate({
                path: "recipeVariants",
                populate: [{ path: "restriction" }, { path: "ingredients" }],
            });

        return recipeDb ? recipeMapper.toDomain(recipeDb, locale) : undefined;
    }

    public async findBy(conditions: any, locale: Locale = Locale.es): Promise<Recipe[]> {
        const recipesDb = await RecipeModel.find({ ...conditions, deletionFlag: false })
            .populate("availableWeeks")
            .populate({
                path: "recipeVariants",
                populate: [{ path: "restriction" }, { path: "ingredients" }],
            });

        return recipesDb.map((recipe: any) => recipeMapper.toDomain(recipe, locale));
    }

    public async findForOrder(order: Order, restrictionId?: RecipeRestrictionId, locale: Locale = Locale.es): Promise<Recipe[]> {
        if (!!restrictionId) {
            return await this.findBy(
                {
                    relatedPlans: order.plan.id.value,
                    availableWeeks: order.week.id.value,
                    "recipeVariants.restriction": restrictionId?.value,
                },
                locale
            );
        } else {
            return await this.findBy(
                {
                    relatedPlans: order.plan.id.value,
                    availableWeeks: order.week.id.value,
                },
                locale
            );
        }
    }

    public async findNextWeekRecipes(locale: Locale = Locale.es): Promise<Recipe[]> {
        const date: Date = new Date();
        date.setDate(date.getDate() + 7);
        const recipesDb = await RecipeModel.find({
            "availableWeeks.minDay": { $gte: date },
            "availableWeeks.maxDay": { $lte: date },
            deletionFlag: false,
        })
            .populate("availableWeeks")
            .populate({
                path: "recipeVariants",
                populate: [{ path: "restriction" }, { path: "ingredients" }],
            });

        return recipesDb.map((recipe: any) => recipeMapper.toDomain(recipe, locale));
    }
    public async delete(recipeId: RecipeId): Promise<void> {
        await RecipeModel.findOneAndUpdate({ _id: recipeId.value }, { deletionFlag: true });
    }
}
