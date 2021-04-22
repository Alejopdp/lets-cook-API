import { expect } from "chai";
import { RecipeTag } from "../../../domain/recipe/RecipeTag";

describe("[DOMAIN] - Recipe tag tests", () => {
    describe("Recipe tag creation", () => {
        describe("Missing name creation", () => {
            it("Should throw", function () {
                expect(() => new RecipeTag("")).to.throw();
            });
        });

        describe("Correct values creation", () => {
            var recipeTag: RecipeTag;

            before(function () {
                recipeTag = new RecipeTag("Test");
            });

            it("Should be created correctly", function () {
                expect(recipeTag.name).to.be.equal("Test");
            });
        });
    });

    describe("Recipe tag equality", () => {
        var tag1: RecipeTag;
        var tag2: RecipeTag;

        describe("2 distinct tags", function () {
            before(function () {
                tag1 = new RecipeTag("test");
                tag2 = new RecipeTag("Test");
            });

            it("Shouldn't be equal", function () {
                expect(tag1.equals(tag2)).to.be.equal(false);
            });
        });

        describe("2 equal tags", function () {
            before(function () {
                tag1 = new RecipeTag("test");
                tag2 = new RecipeTag(tag1.name);
            });

            it("Should be equal", function () {
                expect(tag1.equals(tag2)).to.be.equal(true);
            });
        });
    });
});
