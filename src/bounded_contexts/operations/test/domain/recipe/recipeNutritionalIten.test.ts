// import { expect } from "chai";
// import { NutritionalItem } from "../../../domain/recipe/RecipeNutritionalData/NutritionalItem";

// describe("[DOMAIN] - Recipe nutritional item tests", () => {
//     describe("Recipe nutritional item creation", () => {
//         describe("Missing key creation", () => {
//             var nutritionalItem: NutritionalItem;

//             it("Should throw", function () {
//                 expect(() => (nutritionalItem = new NutritionalItem("", "Value")));
//             });
//         });

//         describe("Missing value creation", () => {
//             var nutritionalItem: NutritionalItem;

//             it("Should throw", function () {
//                 expect(() => (nutritionalItem = new NutritionalItem("Key", "")));
//             });
//         });

//         describe("Good creation", () => {
//             var nutritionalItem: NutritionalItem;

//             before(function () {
//                 nutritionalItem = new NutritionalItem("Key", "value");
//             });

//             it("Should create it correctly", function () {
//                 expect(nutritionalItem.key).to.be.equal("Key");
//                 expect(nutritionalItem.value).to.be.equal("value");
//             });
//         });

//         describe("Nutritional item equality", () => {
//             describe("2 Distinct nutritinoal items", () => {
//                 var item1: NutritionalItem;
//                 var item2: NutritionalItem;

//                 before(function () {
//                     item1 = new NutritionalItem("Key", "value");
//                     item2 = new NutritionalItem("key", "value");
//                 });

//                 it("Shouldn't be equal", function () {
//                     expect(item1.equals(item2)).to.be.equal(false);
//                 });
//             });

//             describe("2 Equal nutritional items", () => {
//                 var item1: NutritionalItem;
//                 var item2: NutritionalItem;

//                 before(function () {
//                     item1 = new NutritionalItem("Key", "value");
//                     item2 = new NutritionalItem("Key", "value");
//                 });

//                 it("Should be equal", function () {
//                     expect(item1.equals(item2)).to.be.equal(true);
//                 });
//             });
//         });
//     });
// });
