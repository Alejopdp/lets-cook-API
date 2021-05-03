import { expect } from "chai";
import { RecipeCookDuration } from "../../../domain/recipe/RecipeGeneralData/RecipeCookDuration";

describe("[DOMAIN] - Recipe cook duration tests", () => {
    describe("Recipe cook duration creation", () => {
        describe("With value < 1", () => {
            it("Should throw", function () {
                expect(() => new RecipeCookDuration(0)).to.throw();
            });
        });

        describe("Correct values", () => {
            var recipeCookDuration: RecipeCookDuration;

            before(function () {
                recipeCookDuration = new RecipeCookDuration(45);
            });

            it("Should be created correctly", function () {
                expect(recipeCookDuration.timeValue).to.be.equal(45);
            });
        });
    });
});
