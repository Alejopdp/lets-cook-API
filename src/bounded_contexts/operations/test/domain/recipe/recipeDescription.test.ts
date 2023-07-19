// import { expect } from "chai";
// import { RecipeDescription } from "../../../domain/recipe/RecipeGeneralData/RecipeDescription";

// describe("[DOMAIN] - Recipe description tests", () => {
//     describe("Recipe description creation", () => {
//         describe("Missing short description", () => {
//             it("Should throw", function () {
//                 expect(() => new RecipeDescription("", "ASda"));
//             });
//         });

//         describe("Missing short description", () => {
//             it("Should throw", function () {
//                 expect(() => new RecipeDescription("ss", ""));
//             });
//         });

//         describe("Correct values creation", () => {
//             var recipeDescription: RecipeDescription;

//             before(function () {
//                 recipeDescription = new RecipeDescription("short test", "long test");
//             });

//             it("Should be created correctly", function () {
//                 expect(recipeDescription.shortDescription).to.be.equal("short test");
//                 expect(recipeDescription.longDescription).to.be.equal("long test");
//             });
//         });
//     });

//     describe("Description equality", () => {
//         var desc1: RecipeDescription;
//         var desc2: RecipeDescription;

//         describe("2 distinct short descriptions", () => {
//             before(function () {
//                 desc1 = new RecipeDescription("test", "test");
//                 desc2 = new RecipeDescription("Test", "test");
//             });

//             it("Shouldn't be equal", function () {
//                 expect(desc1.equals(desc2)).to.be.equal(false);
//             });
//         });

//         describe("2 distinct long descriptions", () => {
//             before(function () {
//                 desc1 = new RecipeDescription("test", "test");
//                 desc2 = new RecipeDescription("test", "Test");
//             });

//             it("Shouldn't be equal", function () {
//                 expect(desc1.equals(desc2)).to.be.equal(false);
//             });
//         });

//         describe("2 equal descriptions", () => {
//             before(function () {
//                 desc1 = new RecipeDescription("test", "test");
//                 desc2 = new RecipeDescription(desc1.shortDescription, desc1.longDescription);
//             });

//             it("Should be equal", function () {
//                 expect(desc1.equals(desc2)).to.be.equal(true);
//             });
//         });
//     });
// });
