import { expect } from "chai";
import { PlanSku } from "../../../domain/plan/PlanSku";
import { PlanVariantAttribute } from "../../../domain/plan/PlanVariant/PlanVariantAttribute";
import { PlanVariantWithRecipe } from "../../../domain/plan/PlanVariant/PlanVariantWithRecipes";

describe("[DOMAIN] - Plan variant with recipes", () => {
    describe("Plan variant w recipes creation tests", () => {
        var planSku: PlanSku;
        describe("Plan w recipes with number of persons < 1", () => {
            var planSku = new PlanSku("PLGV");
            var planVariant: PlanVariantWithRecipe;

            it("Should throw", function () {
                expect(() => (planVariant = new PlanVariantWithRecipe(0, 2, planSku, "Variante", 10, 8, []))).to.throw();
            });
        });

        describe("Plan w recipes with number of recipes < 1", () => {
            var planSku = new PlanSku("PLGV");
            var planVariant: PlanVariantWithRecipe;

            it("Should throw", function () {
                expect(() => (planVariant = new PlanVariantWithRecipe(2, 0, planSku, "Variante", 10, 8, []))).to.throw();
            });
        });

        describe("Plan w recipes and with attribute", () => {
            var planSku = new PlanSku("PLGV");
            var planVariant: PlanVariantWithRecipe;
            var planVariantAttribute: PlanVariantAttribute;

            before(function () {
                planVariantAttribute = new PlanVariantAttribute("Test", "2");
                planVariant = new PlanVariantWithRecipe(2, 2, planSku, "Variante", 10, 8, [planVariantAttribute]);
            });

            it("Should throw", function () {
                expect(planVariant.numberOfPersons).to.be.equal(2);
                expect(planVariant.numberOfRecipes).to.be.equal(2);
                expect(planVariant.sku.code).to.be.equal("PLGV");
                expect(planVariant.name).to.be.equal("Variante");
                expect(planVariant.price).to.be.equal(10);
                expect(planVariant.priceWithOffer).to.be.equal(8);
            });
        });
    });
});
