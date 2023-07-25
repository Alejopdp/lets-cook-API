// import { expect } from "chai";
// import { RecipeWeight } from "../../../domain/recipe/RecipeGeneralData/RecipeWeight";
// import { WeightUnit } from "../../../domain/recipe/RecipeGeneralData/WeightUnit";

// describe("[DOMAIN] - Recipe Weight tests", () => {
//     describe("Recipe weight creation", () => {
//         describe("Value < 1", () => {
//             it("Should throw", function () {
//                 expect(() => new RecipeWeight(0, WeightUnit.Kilogram));
//             });
//         });

//         describe("Correct values", function () {
//             var recipeWeight: RecipeWeight;

//             before(function () {
//                 recipeWeight = new RecipeWeight(1100, WeightUnit.Gram);
//             });

//             it("Should be created correctly", function () {
//                 expect(recipeWeight.weightUnit).to.be.equal(WeightUnit.Gram);
//                 expect(recipeWeight.weightValue).to.be.equal(1100);
//             });
//         });
//     });
//     describe("Recipe weight equality", () => {
//         var weight1: RecipeWeight;
//         var weight2: RecipeWeight;

//         describe("2 Distinct weight units", () => {
//             before(function () {
//                 weight1 = new RecipeWeight(10, WeightUnit.Gram);
//                 weight2 = new RecipeWeight(10, WeightUnit.Kilogram);
//             });

//             it("Shouldn't be equal", function () {
//                 expect(weight1.equals(weight2)).to.be.equal(false);
//             });
//         });

//         describe("2 Distinct weight values", () => {
//             before(function () {
//                 weight1 = new RecipeWeight(11, WeightUnit.Gram);
//                 weight2 = new RecipeWeight(10, WeightUnit.Gram);
//             });

//             it("Shouldn't be equal", function () {
//                 expect(weight1.equals(weight2)).to.be.equal(false);
//             });
//         });

//         describe("2 same weight objects", () => {
//             before(function () {
//                 weight1 = new RecipeWeight(11, WeightUnit.Gram);
//                 weight2 = new RecipeWeight(weight1.weightValue, weight1.weightUnit);
//             });

//             it("Should be equal", function () {
//                 expect(weight1.equals(weight2)).to.be.equal(true);
//             });
//         });
//     });
// });
