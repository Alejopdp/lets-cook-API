// import { expect } from "chai";
// import { Ingredient } from "../../../domain/ingredient/ingredient";

// describe("[DOMAIN] - Ingredient tests", () => {
//     describe("Ingredient creation", () => {
//         var ingredient: Ingredient;
//         describe("Missing name creation", () => {
//             it("Should throw", function () {
//                 expect(() => new Ingredient("")).to.throw();
//             });
//         });

//         describe("Correct values creation", () => {
//             before(function () {
//                 ingredient = new Ingredient("Test");
//             });

//             it("Should be created correctly", function () {
//                 expect(ingredient.name).to.be.equal("Test");
//             });
//         });
//     });

//     describe("Ingredient equality", () => {
//         var ing1: Ingredient;
//         var ing2: Ingredient;

//         describe("2 distinct ingredients", () => {
//             before(function () {
//                 ing1 = new Ingredient("Test");
//                 ing2 = new Ingredient("test");
//             });

//             it("Shouldn't be equal", function () {
//                 expect(ing1.equals(ing2)).to.be.equal(false);
//             });
//         });

//         describe("2 equal ingredients", () => {
//             before(function () {
//                 ing1 = new Ingredient("Test");
//                 ing2 = new Ingredient("Test");
//             });

//             it("Should be equal", function () {
//                 expect(ing1.equals(ing2)).to.be.equal(true);
//             });
//         });
//     });
// });
