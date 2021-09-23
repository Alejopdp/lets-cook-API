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

export class MongooseRecipeRepository implements IRecipeRepository {
    public async save(recipe: Recipe): Promise<void> {
        const recipeDb = recipeMapper.toPersistence(recipe);

        if (await RecipeModel.exists({ _id: recipe.id.value })) {
            await RecipeModel.updateOne({ _id: recipe.id.value }, recipeDb);
        } else {
            await RecipeModel.create(recipeDb);
        }
    }

    public async bulkSave(recipes: Recipe[]): Promise<void> {
        const recipesToSave = recipes.map((recipe) => recipeMapper.toPersistence(recipe));

        await RecipeModel.insertMany(recipesToSave);
    }

    public async findAll(): Promise<Recipe[]> {
        return await this.findBy({});
    }

    public async findByIdList(recipesIds: RecipeId[]): Promise<Recipe[]> {
        const recipes = await this.findBy({ _id: recipesIds.map((id) => id.value) });

        return recipes;
    }

    public async findByWeekId(weekId: WeekId): Promise<Recipe[]> {
        return await this.findBy({ availableWeeks: weekId });
    }

    public async findAllBackOfficeTags(): Promise<RecipeTag[]> {
        const recipes: Recipe[] = await this.findAll();

        return _.uniqBy(_.flatten(recipes.map((recipe) => recipe.recipeBackOfficeTags)), (tag) => tag.name);
    }

    public async findById(recipeId: RecipeId): Promise<Recipe | undefined> {
        const recipeDb = await RecipeModel.findById(recipeId.value)
            .populate("availableWeeks")
            .populate({
                path: "recipeVariants",
                populate: { path: "restriction" },
            });

        return recipeDb ? recipeMapper.toDomain(recipeDb) : undefined;
    }

    public async findBy(conditions: any): Promise<Recipe[]> {
        const recipesDb = await RecipeModel.find({ ...conditions, deletionFlag: false })
            .populate("availableWeeks")
            .populate({
                path: "recipeVariants",
                populate: { path: "restriction" },
            });

        return recipesDb.map((recipe: any) => recipeMapper.toDomain(recipe));
    }

    public async findForOrder(order: Order, restrictionId?: RecipeRestrictionId): Promise<Recipe[]> {
        if (!!restrictionId) {
            return await this.findBy({
                relatedPlans: order.plan.id.value,
                availableWeeks: order.week.id.value,
                "recipeVariants.restriction": restrictionId?.value,
            });
        } else {
            return await this.findBy({
                relatedPlans: order.plan.id.value,
                availableWeeks: order.week.id.value,
            });
        }
    }

    public async findNextWeekRecipes(): Promise<Recipe[]> {
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
                populate: { path: "restriction" },
            });

        return recipesDb.map((recipe: any) => recipeMapper.toDomain(recipe));
    }
    public async delete(recipeId: RecipeId): Promise<void> {
        await RecipeModel.findOneAndUpdate({ _id: recipeId.value }, { deletionFlag: true });
    }
}
