import { Recipe } from "../../../domain/recipe/Recipe";
import { Recipe as RecipeModel } from "../../../../../infraestructure/mongoose/models";
import { RecipeId } from "../../../domain/recipe/RecipeId";
import { WeekId } from "../../../domain/week/WeekId";
import { RecipeTag } from "../../../domain/recipe/RecipeTag";
import { IRecipeRepository } from "./IRecipeRepository";
import _ from "lodash";
import { recipeMapper } from "../../../mappers/recipeMapper";
import { Order } from "../../../domain/order/Order";
import { RecipeRestrictionId } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { RecipeVariantSku } from "@src/bounded_contexts/operations/domain/recipe/RecipeVariant/RecipeVariantSku";
import { Locale } from "../../../domain/locale/Locale";
import { RecipeNutritionalData } from "@src/bounded_contexts/operations/domain/recipe/RecipeNutritionalData/RecipeNutritionalData";
import { PersistenceRecipe } from "@src/bounded_contexts/operations/mappers/recipeMapper/recipeMapper";

export class MongooseRecipeRepository implements IRecipeRepository {
    public async save(recipe: Recipe, locale: Locale = Locale.es): Promise<void> {
        const recipeDb = recipeMapper.toPersistence(recipe, locale) as Partial<PersistenceRecipe>;
        const alreadySavedRecipe = await RecipeModel.findById(recipe.id.toString());

        if (alreadySavedRecipe) {
            const auxRecipeGeneralData = { ...recipeDb.recipeGeneralData };
            const newImageTagsForLocale = [...(recipeDb?.imageTags ?? [])];
            delete recipeDb.recipeGeneralData;
            delete recipeDb.imageTags;
            const nameWithLocaleKey = `recipeGeneralData.name.${locale}`;
            const shortDescriptionWithLocaleKey = `recipeGeneralData.recipeDescription.shortDescription.${locale}`;
            const longDescriptionWithLocaleKey = `recipeGeneralData.recipeDescription.longDescription.${locale}`;
            const imageTagsWithLocaleKey = `imageTags.${locale}`;

            await RecipeModel.updateOne(
                { _id: recipe.id.value },
                {
                    ...recipeDb,
                    nutritionalInfo: this.getUpdatedNutritionalInfoForMongo(
                        recipe.recipeNutritionalData,
                        alreadySavedRecipe.nutritionalInfo,
                        locale
                    ),
                    [imageTagsWithLocaleKey]: newImageTagsForLocale,
                    $set: {
                        ...auxRecipeGeneralData,
                        [nameWithLocaleKey]: auxRecipeGeneralData?.name?.[locale] ?? "",
                        [shortDescriptionWithLocaleKey]: auxRecipeGeneralData?.recipeDescription?.shortDescription[locale],
                        [longDescriptionWithLocaleKey]: auxRecipeGeneralData?.recipeDescription?.longDescription[locale],
                        "recipeGeneralData.recipeCookDuration": {
                            timeValue: auxRecipeGeneralData?.recipeCookDuration?.timeValue,
                            timeUnit: auxRecipeGeneralData?.recipeCookDuration?.timeUnit,
                        },
                        "recipeGeneralData.recipeWeight": {
                            weightValue: auxRecipeGeneralData?.recipeWeight?.weightValue,
                            weightUnit: auxRecipeGeneralData?.recipeWeight?.weightUnit,
                        },
                        "recipeGeneralData.sku": auxRecipeGeneralData.sku,
                        "recipeGeneralData.imagesUrls": auxRecipeGeneralData.imagesUrls,
                        "recipeGeneralData.difficultyLevel": auxRecipeGeneralData.difficultyLevel,
                    },
                }
            );
        } else {
            const newRecipe = {
                ...recipeDb,
                nutritionalInfo: this.getNutritionalInfoForCreatingItInMongo(recipeDb?.nutritionalInfo ?? []),
                imageTags: this.getImageTagsForCreatingThemInMongo(recipeDb?.imageTags ?? []),
            };
            await RecipeModel.create(newRecipe);
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

    public async findByRecipeVariantSkuOrThrow(recipeVariantSku: string, locale: Locale): Promise<Recipe> {
        const recipe = await RecipeModel.findOne({ "recipeVariants.sku": recipeVariantSku })
            .populate("availableWeeks")
            .populate({
                path: "recipeVariants",
                populate: [{ path: "restriction" }, { path: "ingredients" }],
            });

        if (!!!recipe) throw new Error("La variante ingresada no pertenece a ninguna receta");

        return recipeMapper.toDomain(recipe);
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

    private getImageTagsForCreatingThemInMongo(tags: string[]): { es: string[]; en: string[]; ca: string[] } {
        return {
            es: tags,
            en: tags,
            ca: tags,
        };
    }

    private getNutritionalInfoForCreatingItInMongo(
        nutritionalInfo: {
            _id: string;
            key: string;
            value: string;
        }[]
    ): { es: { key: string; value: string }; en: { key: string; value: string }; ca: { key: string; value: string } }[] {
        return nutritionalInfo.map((infoItem) => ({
            es: { key: infoItem.key, value: infoItem.value },
            en: { key: infoItem.key, value: infoItem.value },
            ca: { key: infoItem.key, value: infoItem.value },
        }));
    }

    private getUpdatedNutritionalInfoForMongo(
        newNutritionalData: RecipeNutritionalData,
        //@ts-ignore
        oldValues: { _id: string;[locale: string]: { key: string; value: string } }[],
        locale: Locale
    ): any {
        const finalArray: any[] = [];

        for (let nutritionalItem of newNutritionalData.nutritionalItems) {
            const oldValue = oldValues.find((old) => {
                return old._id.toString() === nutritionalItem.id;
            });

            if (oldValue) {
                oldValue[locale]["key"] = nutritionalItem.key;
                oldValue[locale]["value"] = nutritionalItem.value;
                finalArray.push(oldValue);
            }

            if (!oldValue) {
                finalArray.push({
                    [Locale.es]: { key: nutritionalItem.key, value: nutritionalItem.value },
                    [Locale.en]: { key: nutritionalItem.key, value: nutritionalItem.value },
                    [Locale.ca]: { key: nutritionalItem.key, value: nutritionalItem.value },
                });
            }
        }

        return finalArray;
    }
}
