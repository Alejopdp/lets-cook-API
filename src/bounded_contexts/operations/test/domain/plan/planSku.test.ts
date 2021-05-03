import { expect } from "chai";
import { PlanSku } from "../../../domain/plan/PlanSku";

describe("[DOMAIN] - PlanSKU tests", function () {
    describe("Plan SKU creation", function () {
        var planSku: PlanSku;

        describe("Plan SKU without code", () => {
            it("Should throw", () => {
                expect(() => (planSku = new PlanSku(""))).to.throw();
            });
        });

        describe("Plan SKU with code", () => {
            before(function () {
                planSku = new PlanSku("PLG1");
            });

            it("Should be created correctly", function () {
                expect(planSku.code).to.be.equal("PLG1");
            });
        });
    });

    describe("Plan SKU Equality", () => {
        var planSku: PlanSku;

        before(function () {
            planSku = new PlanSku("PLG1");
        });

        it("Should be equal to a same SKU", function () {
            expect(planSku.equals(new PlanSku("PLG1"))).to.be.equal(true);
        });
    });
});
