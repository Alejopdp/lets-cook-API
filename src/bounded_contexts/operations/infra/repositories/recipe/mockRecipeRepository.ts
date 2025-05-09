import { Locale } from "@src/bounded_contexts/operations/domain/locale/Locale";
import { RecipeVariantSku } from "@src/bounded_contexts/operations/domain/recipe/RecipeVariant/RecipeVariantSku";
import _ from "lodash";
import { Order } from "../../../domain/order/Order";
import { Recipe } from "../../../domain/recipe/Recipe";
import { RecipeId } from "../../../domain/recipe/RecipeId";
import { RecipeTag } from "../../../domain/recipe/RecipeTag";
import { RecipeRestrictionId } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/recipeRestrictionId";
import { WeekId } from "../../../domain/week/WeekId";
import { IRecipeRepository } from "./IRecipeRepository";

export class MockRecipeRepository implements IRecipeRepository {
    private _database: Recipe[];

    constructor(database: Recipe[]) {
        this._database = database;
    }
    findAllAvailableOnWeeks(weeksIds: WeekId[], locale?: Locale | undefined): Promise<Recipe[]> {
        throw new Error("Method not implemented.");
    }
    findByRecipeVariantSkuOrThrow(recipeVariantId: string, locale: Locale): Promise<Recipe> {
        throw new Error("Method not implemented.");
    }
    findByRecipeVariantSkuList(recipeVariantSkus: RecipeVariantSku[]): Promise<Recipe[]> {
        throw new Error("Method not implemented.");
    }
    public async findByIdList(recipesIds: RecipeId[]): Promise<Recipe[]> {
        return this.database.filter((recipe) => recipesIds.some((id) => id.equals(recipe.id)));
    }
    public async findForOrder(order: Order, restrictionId?: RecipeRestrictionId): Promise<Recipe[]> {

        if (!!restrictionId) {
            return this.database.filter((recipe) => {
                return (
                    recipe.relatedPlans.some((planId) => planId.equals(order.plan.id)) &&
                    recipe.availableWeeks.some((week) => week.id.equals(order.week.id)) &&
                    recipe.recipeVariants.some((variant) => variant.restriction.id.equals(restrictionId))
                );
            });
        } else {
            return this.database.filter((recipe) => {
                return (
                    recipe.relatedPlans.some((planId) => planId.equals(order.plan.id)) &&
                    recipe.availableWeeks.some((week) => week.id.equals(order.week.id))
                );
            });
        }
    }
    findNextWeekRecipes(): Promise<Recipe[]> {
        throw new Error("Method not implemented.");
    }
    findByWeekId(weekId: WeekId): Promise<Recipe[]> {
        throw new Error("Method not implemented.");
    }

    public async bulkSave(recipes: Recipe[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async save(recipe: Recipe): Promise<void> {
        const filteredDatabase = this.database.filter((r) => !recipe.equals(r));

        this.database = [...filteredDatabase, recipe];
    }

    public async findById(recipeId: RecipeId): Promise<Recipe | undefined> {
        return this.database.find((r) => r.id.equals(recipeId));
    }

    public async findAll(): Promise<Recipe[]> {
        return this.database;
    }

    public async findAllBackOfficeTags(): Promise<RecipeTag[]> {
        return _.uniq(_.flatten(this.database.map((recipe) => recipe.recipeBackOfficeTags)));
    }

    public async findBy(conditions: any): Promise<Recipe[]> {
        throw new Error("Method not implemented.");
    }

    public async delete(recipeId: RecipeId): Promise<void> {
        this.database = this.database.filter((r) => !r.id.equals(recipeId));
    }

    /**
     * Getter database
     * @return {Recipe[]}
     */
    public get database(): Recipe[] {
        return this._database;
    }

    /**
     * Setter database
     * @param {Recipe[]} value
     */
    public set database(value: Recipe[]) {
        this._database = value;
    }
}
