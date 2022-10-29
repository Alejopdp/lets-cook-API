// To run from root, execute the following:
// npx ts-node scripts/updateImageTagsToNewStructure.ts


import { Recipe as RecipeModel } from "../src/infraestructure/mongoose/models";
import { connectToDatabase } from "../src/infraestructure/mongoose/config/config";

export const updateImageTagsToNewStructure = async () => {
    process.env.NODE_ENV = "staging";
    process.env.URLDB = "mongodb+srv://lets_cook_admin:Rwn7Bu2VJqju6Yia@ecommerce.6octe.mongodb.net/";
    console.log("Starting script");
    await connectToDatabase();
    const rawRecipes = await RecipeModel.find({}, {}, { lean: true });

    for (let recipe of rawRecipes) {
        if (!Array.isArray(recipe.imageTags)) continue;
        console.log("Processing recipe: ", recipe._id.toString());
        const imageTags: { es: string[]; en: string[]; ca: string[] } = {
            es: recipe.imageTags as string[],
            en: recipe.imageTags as string[],
            ca: recipe.imageTags as string[],
        };

        await RecipeModel.updateOne({ _id: recipe._id }, { imageTags });
        console.log("Recipe updated correctly");
    }

    console.log("Script finished successfully");
    return;
};

updateImageTagsToNewStructure();
