// import { expect } from "chai";
// import { RecipeCookDuration } from "../../../domain/recipe/RecipeGeneralData/RecipeCookDuration";
// import { RecipeDescription } from "../../../domain/recipe/RecipeGeneralData/RecipeDescription";
// import { RecipeDifficultyLevel } from "../../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
// import { RecipeGeneralData } from "../../../domain/recipe/RecipeGeneralData/RecipeGeneralData";
// import { RecipeSku } from "../../../domain/recipe/RecipeGeneralData/RecipeSku";
// import { RecipeWeight } from "../../../domain/recipe/RecipeGeneralData/RecipeWeight";
// import { WeightUnit } from "../../../domain/recipe/RecipeGeneralData/WeightUnit";

// describe("[DOMAIN] - Recipe General Data", () => {
//     describe("Recipe general data creation", () => {
//         var recipeSku: RecipeSku;
//         var recipeDescription: RecipeDescription;
//         var recipeCookDuration: RecipeCookDuration;
//         var recipeWeight: RecipeWeight;
//         var recipeLevel: RecipeDifficultyLevel;

//         describe("Missing name", () => {
//             before(function () {
//                 recipeCookDuration = new RecipeCookDuration(1);
//                 recipeWeight = new RecipeWeight(1, WeightUnit.Gram);
//                 recipeSku = new RecipeSku("RCP8");
//                 recipeDescription = new RecipeDescription("short", "long");
//                 recipeLevel = RecipeDifficultyLevel.Easy;
//             });

//             it("Should throw", function () {
//                 expect(
//                     () => new RecipeGeneralData("", recipeDescription, recipeCookDuration, recipeLevel, recipeWeight, recipeSku, "s")
//                 ).to.throw();
//             });
//         });

//         describe("Missing image url", () => {
//             it("Should throw", function () {
//                 expect(
//                     () =>
//                         new RecipeGeneralData(
//                             "Recipe name",
//                             recipeDescription,
//                             recipeCookDuration,
//                             recipeLevel,
//                             recipeWeight,
//                             recipeSku,
//                             ""
//                         )
//                 );
//             });
//         });

//         describe("Correct values creation", function () {
//             var recipeGeneralData: RecipeGeneralData;

//             before(function () {
//                 recipeGeneralData = new RecipeGeneralData(
//                     "Name",
//                     recipeDescription,
//                     recipeCookDuration,
//                     recipeLevel,
//                     recipeWeight,
//                     recipeSku,
//                     "asd"
//                 );
//             });

//             it("Should be created correctly", function () {
//                 expect(recipeGeneralData.name).to.be.equal("Name");
//                 expect(recipeGeneralData.recipeDescription.equals(recipeDescription)).to.be.equal(true);
//                 expect(recipeGeneralData.cookDuration.equals(recipeCookDuration)).to.be.equal(true);
//                 expect(recipeGeneralData.difficultyLevel).to.be.equal(RecipeDifficultyLevel.Easy);
//                 expect(recipeGeneralData.recipeSku.equals(recipeSku)).to.be.equal(true);
//                 expect(recipeGeneralData.recipeWeight.equals(recipeWeight)).to.be.equal(true);
//                 expect(recipeGeneralData.imageUrl).to.be.equal("asd");
//             });
//         });
//     });
// });
