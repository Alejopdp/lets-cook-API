// import { expect } from "chai";
// import { NutritionalItem } from "../../../domain/recipe/RecipeNutritionalData/NutritionalItem";
// import { RecipeNutritionalData } from "../../../domain/recipe/RecipeNutritionalData/RecipeNutritionalData";

// describe("[DOMAIN] - Recipe nutritional data", () => {
//     describe("Recipe nutritional data creation", () => {
//         describe("Recipe nutritional data without any item", () => {
//             it("Should throw", function () {
//                 expect(() => new RecipeNutritionalData([])).to.throw();
//             });
//         });

//         describe("Recipe nutritional data with items", () => {
//             var item1: NutritionalItem;
//             var recipeNutritionalData: RecipeNutritionalData;

//             before(function () {
//                 item1 = new NutritionalItem("Key", "value");
//                 recipeNutritionalData = new RecipeNutritionalData([item1]);
//             });

//             it("Should have it items", function () {
//                 expect(recipeNutritionalData.nutritionalItems.length).to.be.equal(1);
//                 expect(recipeNutritionalData.nutritionalItems[0].key).to.be.equal("Key");
//                 expect(recipeNutritionalData.nutritionalItems[0].value).to.be.equal("value");
//             });
//         });

//         describe("Recipe nutritional data equality", () => {
//             describe("2 same nutritional data", () => {
//                 var item1: NutritionalItem;
//                 var data1: RecipeNutritionalData;
//                 var data2: RecipeNutritionalData;

//                 before(function () {
//                     item1 = new NutritionalItem("Key", "value");
//                     data1 = new RecipeNutritionalData([item1]);
//                     data2 = new RecipeNutritionalData(data1.nutritionalItems);
//                 });

//                 it("Should be equal", function () {
//                     expect(data1.equals(data2)).to.be.equal(true);
//                 });
//             });

//             describe("2 distinct nutritional data", () => {
//                 var item1: NutritionalItem;
//                 var item2: NutritionalItem;
//                 var data1: RecipeNutritionalData;
//                 var data2: RecipeNutritionalData;

//                 before(function () {
//                     item1 = new NutritionalItem("Key", "value");
//                     item2 = new NutritionalItem("key", "value");
//                     data1 = new RecipeNutritionalData([item1]);
//                     data2 = new RecipeNutritionalData([item2]);
//                 });

//                 it("Shouldn't be equal", function () {
//                     expect(data1.equals(data2)).to.be.equal(false);
//                 });
//             });
//         });
//     });
// });
