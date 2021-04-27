import { expect } from "chai";
import { Plan } from "../../../domain/plan/Plan";
import { PlanFrequency } from "../../../domain/plan/PlanFrequency";
import { PlanSku } from "../../../domain/plan/PlanSku";
import { PlanType } from "../../../domain/plan/PlanType/PlanType";
import { PlanVariant } from "../../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantAttribute } from "../../../domain/plan/PlanVariant/PlanVariantAttribute";
import { PlanVariantWithRecipe } from "../../../domain/plan/PlanVariant/PlanVariantWithRecipes";
import * as _ from "lodash";
import { logger } from "../../../../../../config";

describe("[DOMAIN] - Plan tests", function () {
    var planSku: PlanSku;

    before(function () {
        planSku = new PlanSku("PLVG1");
    });

    describe("Plan creation tests", function () {
        var plan: Plan;

        describe("Plan without name", function () {
            it("Should throw", function () {
                expect(() => (plan = Plan.create("", "Test", planSku, "", true, PlanType.Principal, [], [PlanFrequency.Quincenal], true)));
            });
        });

        describe("Plan without description", function () {
            it("Should throw", function () {
                expect(() => (plan = Plan.create("Test", "", planSku, "", true, PlanType.Principal, [], [PlanFrequency.Quincenal], true)));
            });
        });

        describe("Plan without a variant", function () {
            it("Should throw", function () {
                expect(
                    () =>
                        (plan = Plan.create(
                            "Plan vegetariano",
                            "Un plan con recetas vegetarianas",
                            planSku,
                            "",
                            true,
                            PlanType.Principal,
                            [],
                            [PlanFrequency.Semanal],
                            true
                        ))
                ).to.throw();
            });
        });
        describe("Plan without recipes and 1 attribute with N values", () => {
            var planVariants: PlanVariant[] = [];
            var planVariantAttribute1: PlanVariantAttribute;
            var planVariantAttribute2: PlanVariantAttribute;
            var planVariantAttribute3: PlanVariantAttribute;
            var planVariantAttributes: PlanVariantAttribute[];
            var planSku1: PlanSku;
            var planSku2: PlanSku;
            var planSku3: PlanSku;

            before(function () {
                planSku1 = new PlanSku("PLGV1");
                planSku2 = new PlanSku("PLGV2");
                planSku3 = new PlanSku("PLGV3");
                planVariantAttribute1 = new PlanVariantAttribute("Cantidad de algo", "1");
                planVariantAttribute2 = new PlanVariantAttribute("Cantidad de algo", "2");
                planVariantAttribute3 = new PlanVariantAttribute("Cantidad de algo", "3");
                planVariantAttributes = [planVariantAttribute1, planVariantAttribute2, planVariantAttribute3];

                planVariants.push(new PlanVariant(planSku1, "Variant 1", 10, [planVariantAttribute1], 8));
                planVariants.push(new PlanVariant(planSku2, "Variant 2", 10, [planVariantAttribute2], 8));
                planVariants.push(new PlanVariant(planSku3, "Variant 3", 10, [planVariantAttribute3], 8));

                plan = Plan.create(
                    "Plan veggie",
                    "Un plan Veggie",
                    planSku,
                    "",
                    true,
                    PlanType.Principal,
                    planVariants,
                    [PlanFrequency.Quincenal, PlanFrequency.Semanal],
                    true
                );
            });

            it("Should have 3 distinct variants", function () {
                expect(plan.planVariants.length).to.be.equal(3);
                expect(_.uniqBy(plan.planVariants, (pv) => pv.sku).length).to.be.equal(3);
            });
        });

        describe("Plan variants with recipes", () => {
            var planVariants: PlanVariantWithRecipe[] = [];
            var planVariant1: PlanVariantWithRecipe;
            var planVariant2: PlanVariantWithRecipe;
            var planVariant3: PlanVariantWithRecipe;
            var planSku1: PlanSku;
            var planSku2: PlanSku;
            var planSku3: PlanSku;
            var plan: Plan;

            before(function () {
                planSku1 = new PlanSku("PLGV1");
                planSku2 = new PlanSku("PLGV2");
                planSku3 = new PlanSku("PLGV3");
                planVariant1 = new PlanVariantWithRecipe(1, 1, planSku1, "Variant 1", 10, 8, []);
                planVariant2 = new PlanVariantWithRecipe(1, 2, planSku2, "Variant 2", 15, 13, []);
                planVariant3 = new PlanVariantWithRecipe(1, 3, planSku3, "Variant 3", 20, 18, []);

                planVariants = [planVariant1, planVariant2, planVariant3];

                plan = Plan.create(
                    "Plan veg",
                    "Plan veg",
                    new PlanSku("PLGV"),
                    "",
                    false,
                    PlanType.Principal,
                    planVariants,
                    [PlanFrequency.Quincenal],
                    true
                );
            });
        });
    });
});
