import { expect } from "chai";
import { Ingredient } from "../../../domain/ingredient/ingredient";
import { RecipeVariant } from "../../../domain/recipe/RecipeVariant/RecipeVariant";
import { RecipeVariantRestriction } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeVariantSku } from "../../../domain/recipe/RecipeVariant/RecipeVariantSku";

describe("[DOMAIN] - Recipe variant tests", () => {
    describe("Recipe variant creation", () => {
        var recipeVariantSku: RecipeVariantSku;
        var recipeVariant: RecipeVariant;
        var ingredient1: Ingredient;
        var ingredient2: Ingredient;

        describe("Recipe without any ingredient", () => {
            before(function () {
                recipeVariantSku = new RecipeVariantSku("RV25");
            });

            it("Should throw", function () {
                expect(() => new RecipeVariant([], [], recipeVariantSku));
            });
        });

        describe("Correct values creation", function () {
            before(function () {
                ingredient1 = new Ingredient("Test");
                ingredient2 = new Ingredient("Test 1");
                recipeVariantSku = new RecipeVariantSku("RV25");
                recipeVariant = new RecipeVariant([ingredient1, ingredient2], [], recipeVariantSku);
            });

            it("Should be created correctly", function () {
                expect(recipeVariant.sku.equals(recipeVariantSku)).to.be.equal(true);
                expect(recipeVariant.recipeVariantRestriction.length).equal(0);
                expect(recipeVariant.ingredients.every((ing) => ing.equals(ingredient1) || ing.equals(ingredient2)));
            });
        });

        describe("Recipe with 2 equal ingredients", () => {
            before(function () {
                ingredient1 = new Ingredient("Test");
                ingredient2 = new Ingredient(ingredient1.name);
                recipeVariant = new RecipeVariant([ingredient1, ingredient2], [RecipeVariantRestriction.SinGluten], recipeVariantSku);
            });

            it("Should create the recipe with the duplicated ingredients removed", function () {
                expect(recipeVariant.ingredients.length).to.be.equal(1);
            });
        });
    });
});
