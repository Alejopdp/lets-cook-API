import { Recipe } from "../../../domain/recipe/Recipe";
import { Recipe as RecipeModel } from "../../../../../infraestructure/mongoose/models";
import { RecipeId } from "../../../domain/recipe/RecipeId";
import { RecipeTag } from "../../../domain/recipe/RecipeTag";
import { IRecipeRepository } from "./IRecipeRepository";
import { recipeMapper } from "../../../mappers";
import _ from "lodash";

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

        await RecipeModel.create(recipesToSave);
    }

    public async findAll(): Promise<Recipe[]> {
        return await this.findBy({});
    }

    public async findAllBackOfficeTags(): Promise<RecipeTag[]> {
        const recipes: Recipe[] = await this.findAll();

        return _.uniqBy(_.flatten(recipes.map((recipe) => recipe.recipeBackOfficeTags)), (tag) => tag.name);
    }

    public async findById(recipeId: RecipeId): Promise<Recipe | undefined> {
        const recipeDb = await RecipeModel.findById(recipeId.value);

        return recipeDb ? recipeMapper.toDomain(recipeDb) : undefined;
    }

    public async findBy(conditions: any): Promise<Recipe[]> {
        const recipesDb = await RecipeModel.find({ ...conditions, deletionFlag: false }).populate("availableWeeks");

        return recipesDb.map((recipe) => recipeMapper.toDomain(recipe));
    }

    public async delete(recipeId: RecipeId): Promise<void> {
        await RecipeModel.findOneAndUpdate({ _id: recipeId.value }, { deletionFlag: true });
    }
}
