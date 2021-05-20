// import { Recipe } from "../../../domain/recipe/Recipe";
// import { RecipeId } from "../../../domain/recipe/RecipeId";
// import { RecipeTag } from "../../../domain/recipe/RecipeTag";
// import { IRecipeRepository } from "./IRecipeRepository";

// export class MongooseRepository implements IRecipeRepository {

//     public async save(recipe: Recipe): Promise<void> {
//         const planDb = planMapper.toPersistence(plan);
//         if (await MongoosePlan.exists({ _id: plan.id.value })) {
//             await MongoosePlan.updateOne({ _id: plan.id.value }, this.getRawPlanWithLocaleForUpdatingIt(planDb, plan.locale));
//         } else {
//             await MongoosePlan.create(planDb);
//         }
//     }

//     public async findAll(): Promise<Recipe[]> {
//         throw new Error("Method not implemented.");
//     }

//     public async findAllBackOfficeTags(): Promise<RecipeTag[]> {
//         throw new Error("Method not implemented.");
//     }

//     public async findById(recipeId: RecipeId): Promise<Recipe | undefined> {
//         throw new Error("Method not implemented.");
//     }

//     public async findBy(conditions: any): Promise<Recipe[]> {
//         throw new Error("Method not implemented.");
//     }

//     public async delete(recipeId: RecipeId): Promise<void> {
//         throw new Error("Method not implemented.");
//     }

// }
