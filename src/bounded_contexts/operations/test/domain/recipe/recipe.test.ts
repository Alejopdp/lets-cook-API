import { expect } from "chai";
import { Ingredient } from "../../../domain/ingredient/ingredient";
import { Recipe } from "../../../domain/recipe/Recipe";
import { RecipeCookDuration } from "../../../domain/recipe/RecipeGeneralData/RecipeCookDuration";
import { RecipeDescription } from "../../../domain/recipe/RecipeGeneralData/RecipeDescription";
import { RecipeDifficultyLevel } from "../../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { RecipeGeneralData } from "../../../domain/recipe/RecipeGeneralData/RecipeGeneralData";
import { RecipeSku } from "../../../domain/recipe/RecipeGeneralData/RecipeSku";
import { RecipeWeight } from "../../../domain/recipe/RecipeGeneralData/RecipeWeight";
import { WeightUnit } from "../../../domain/recipe/RecipeGeneralData/WeightUnit";
import { NutritionalItem } from "../../../domain/recipe/RecipeNutritionalData/NutritionalItem";
import { RecipeNutritionalData } from "../../../domain/recipe/RecipeNutritionalData/RecipeNutritionalData";
import { RecipeTag } from "../../../domain/recipe/RecipeTag";
import { RecipeVariant } from "../../../domain/recipe/RecipeVariant/RecipeVariant";
import { RecipeVariantId } from "../../../domain/recipe/RecipeVariant/RecipeVariantId";
import { RecipeVariantRestriction } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeVariantSku } from "../../../domain/recipe/RecipeVariant/RecipeVariantSku";

describe("[DOMAIN] - Recipe tests", () => {
    describe("Recipe creation", () => {
        var recipe: Recipe;
        var recipeGeneralData: RecipeGeneralData;
        var recipeDescription: RecipeDescription;
        var recipeCookDuration: RecipeCookDuration;
        var recipeWeight: RecipeWeight;
        var recipeSku: RecipeSku;
        var recipeNutritionalData: RecipeNutritionalData;
        var nutritionalItem1: NutritionalItem;

        before(function () {
            recipeDescription = new RecipeDescription("Short", "Long");
            recipeCookDuration = new RecipeCookDuration(45);
            recipeWeight = new RecipeWeight(20, WeightUnit.Kilogram);
            recipeSku = new RecipeSku("RCV9");
            recipeGeneralData = new RecipeGeneralData(
                "Test recipe",
                recipeDescription,
                recipeCookDuration,
                RecipeDifficultyLevel.Easy,
                recipeWeight,
                recipeSku,
                "sda"
            );
            nutritionalItem1 = new NutritionalItem("Proteinas", "10g");
            recipeNutritionalData = new RecipeNutritionalData([nutritionalItem1]);
        });

        describe("Recipe without variations", () => {
            it("Should throw", function () {
                expect(() => new Recipe(recipeGeneralData, [], [], [], recipeNutritionalData, [])).to.throw();
            });
        });

        describe("Recipe correct values creation", () => {
            var ingredient1: Ingredient;
            var ingredient2: Ingredient;
            var recipeVariant1: RecipeVariant;
            var recipeVariant2: RecipeVariant;
            var recipeVariant1Sku: RecipeVariantSku;
            var recipeVariant2Sku: RecipeVariantSku;

            before(function () {
                ingredient1 = new Ingredient("Pollo");
                ingredient2 = new Ingredient("Cerdo");

                recipeVariant1Sku = new RecipeVariantSku("RCP1");
                recipeVariant2Sku = new RecipeVariantSku("RCP2");

                recipeVariant1 = new RecipeVariant(
                    [ingredient1],
                    [RecipeVariantRestriction.SinGluten, RecipeVariantRestriction.SinLactosa],
                    recipeVariant1Sku
                );
                recipeVariant2 = new RecipeVariant(
                    [ingredient2],
                    [RecipeVariantRestriction.SinGluten, RecipeVariantRestriction.SinLactosa],
                    recipeVariant2Sku
                );
            });

            it("Should be created correctly", function () {
                expect(
                    () => new Recipe(recipeGeneralData, [recipeVariant1, recipeVariant2], [], [], recipeNutritionalData, [])
                ).to.not.throw();
            });
        });

        // describe('Recipe with 2 equal variants', () => {
        //     var ingredient1: Ingredient;
        //     var recipeVariant1: RecipeVariant;
        //     var recipeVariant2: RecipeVariant;
        //     var recipeVariant1Sku: RecipeVariantSku;
        //     var recipeVariant2Sku: RecipeVariantSku;

        //     before(function () {
        //         ingredient1 = new Ingredient("Pollo");

        //         recipeVariant1Sku = new RecipeVariantSku("RCP1");
        //         recipeVariant2Sku = new RecipeVariantSku("RCP2");

        //         recipeVariant1 = new RecipeVariant(
        //             [ingredient1],
        //             [RecipeVariantRestriction.SinGluten, RecipeVariantRestriction.SinLactosa],
        //             recipeVariant1Sku
        //         );
        //         recipeVariant2 = new RecipeVariant(
        //             [ingredient1],
        //             [RecipeVariantRestriction.SinGluten, RecipeVariantRestriction.SinLactosa],
        //             recipeVariant2Sku
        //         );
        //     })

        // })

        describe("Recipe with 2 equal recipe image tags", function () {
            var tag1: RecipeTag;
            var tag2: RecipeTag;

            before(function () {
                tag1 = new RecipeTag("Mas vendido");
                tag2 = new RecipeTag("Mas vendido");
                recipe = new Recipe(recipeGeneralData, [], [tag1, tag2], [], recipeNutritionalData, []);
            });

            it("Should create the recipe removing the duplicated recipe tags", function () {
                expect(recipe.recipeImageTags.length).to.be.equal(1);
            });
        });

        describe("Recipe with 2 equal recipe back office tags", function () {
            var tag1: RecipeTag;
            var tag2: RecipeTag;

            before(function () {
                tag1 = new RecipeTag("Mas vendido");
                tag2 = new RecipeTag("Mas vendido");
                recipe = new Recipe(recipeGeneralData, [], [], [tag1, tag2], recipeNutritionalData, []);
            });

            it("Should create the recipe removing the duplicated recipe tags", function () {
                expect(recipe.recipeBackOfficeTags.length).to.be.equal(1);
            });
        });
    });
});
