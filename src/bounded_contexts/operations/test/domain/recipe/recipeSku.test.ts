// import { expect } from "chai";
// import { RecipeSku } from "../../../domain/recipe/RecipeGeneralData/RecipeSku";

// describe("[DOMAIN] - Recipe SKU tests", () => {
//     describe("Recipe SKU creation", () => {
//         describe("Missing value", () => {
//             it("Should throw", function () {
//                 expect(() => new RecipeSku(""));
//             });
//         });

//         describe("Correct values creation", () => {
//             var recipeSku: RecipeSku;

//             before(function () {
//                 recipeSku = new RecipeSku("RCP");
//             });

//             it("Should be created correctly", function () {
//                 expect(recipeSku.code).to.be.equal("RCP");
//             });
//         });
//     });

//     describe("Recipe SKU equality", () => {
//         var recipeSku1: RecipeSku;
//         var recipeSku2: RecipeSku;

//         describe("2 distinct codes", () => {
//             before(function () {
//                 recipeSku1 = new RecipeSku("test");
//                 recipeSku2 = new RecipeSku("Test");
//             });

//             it("Shouldn't be equal", function () {
//                 expect(recipeSku1.equals(recipeSku2)).to.be.equal(false);
//             });
//         });

//         describe("2 equal recipe SKUs", () => {
//             before(function () {
//                 recipeSku1 = new RecipeSku("test");
//                 recipeSku2 = new RecipeSku(recipeSku1.code);
//             });

//             it("Should be equal", function () {
//                 expect(recipeSku1.equals(recipeSku2)).to.be.equal(true);
//             });
//         });
//     });
// });
