import { Recipe as RecipeModel } from "../src/infraestructure/mongoose/models";
import { connectToDatabase } from "../src/infraestructure/mongoose/config/config";

export const updateNutritionalInfoToNewStructure = async () => {
    process.env.NODE_ENV = "development";
    process.env.URLDB = "mongodb://localhost:27017/lets-cook-local";
    console.log("Starting script");
    await connectToDatabase();
    const rawRecipes = await RecipeModel.find({}, {}, { lean: true });

    for (let recipe of rawRecipes) {
        if (!Array.isArray(recipe.nutritionalInfo) || recipe._id.toString() === "3e4f81a5-4a51-4acd-a243-9ca3359a41be") continue;
        console.log("Processing recipe: ", recipe._id.toString());
        const nutritionalInfo = recipe.nutritionalInfo.map((oldNutriItem: { _id: string; key: string; value: string }) => {
            return {
                es: { key: oldNutriItem.key, value: oldNutriItem.value },
                en: { key: oldNutriItem.key, value: oldNutriItem.value },
                ca: { key: oldNutriItem.key, value: oldNutriItem.value },
                _id: oldNutriItem._id.toString(),
            };
        });
        await RecipeModel.updateOne({ _id: recipe._id }, { nutritionalInfo });
        console.log("Recipe updated correctly");
    }

    console.log("Script finished successfully");
    return;
};

// updateNutritionalInfoToNewStructure();
