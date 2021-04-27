import { Recipe } from "../../domain/recipe/Recipe";

export class GetRecipeListPresenter {
    public static present(recipes: Recipe[]): any {
        const presentedRecipes = [];

        for (let recipe of recipes) {
            presentedRecipes.push({
                id: recipe.id.value,
                name: recipe.recipeGeneralData.name,
                sku: recipe.recipeGeneralData.recipeSku.code,
                shortDescription: recipe.recipeGeneralData.recipeDescription.shortDescription,
                longDescription: recipe.recipeGeneralData.recipeDescription.longDescription,
                cookDuration: recipe.recipeGeneralData.cookDuration.value(),
                difficultyLevel: recipe.recipeGeneralData.difficultyLevel,
                imageUrl: recipe.recipeGeneralData.imageUrl,
                weight: recipe.recipeGeneralData.recipeWeight.value(),
                backOfficeTags: recipe.recipeBackOfficeTags.map((tag) => tag.name),
                imageTags: recipe.recipeImageTags.map((tag) => tag.name),

                // TO DO: Calendar
            });
        }
        return presentedRecipes;
    }
}
