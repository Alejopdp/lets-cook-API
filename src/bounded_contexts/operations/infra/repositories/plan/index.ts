import { Plan } from "../../../domain/plan/Plan";
import { PlanFrequency } from "../../../domain/plan/PlanFrequency";
import { PlanId } from "../../../domain/plan/PlanId";
import { PlanSku } from "../../../domain/plan/PlanSku";
import { PlanType } from "../../../domain/plan/PlanType/PlanType";
import { PlanVariantWithRecipe } from "../../../domain/plan/PlanVariant/PlanVariantWithRecipes";
import { IPlanRepository } from "./IPlanRepository";
import { MockPlanRepository } from "./mockPlanRepository";

const plan1Id: PlanId = new PlanId(1);
const plan2Id: PlanId = new PlanId(2);
const plan3Id: PlanId = new PlanId(3);

const variantWithoutGluten1 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLFMLNGL1"), "Familiar sin gluten", 30, 20, []);
const variantWithoutGluten2 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLVEGNGL1"), "Vegetariano sin gluten", 30, 20, []);
const variantWithoutGluten3 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLCARNGL1"), "Carnívoro sin gluten", 30, 20, []);

const plan1: Plan = Plan.create(
    "Plan familiar",
    "Plan para toda la familia",
    new PlanSku("PLFML"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten1],
    [PlanFrequency.Mensual],
    true,
    plan1Id
);
const plan2: Plan = Plan.create(
    "Plan vegetariano",
    "Plan para vegetarianos",
    new PlanSku("PLVEG"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten2],
    [PlanFrequency.Semanal, PlanFrequency.Quincenal],
    true,
    plan2Id
);
const plan3: Plan = Plan.create(
    "Plan carnívoro",
    "Para los que le gustan los asaditos",
    new PlanSku("PLCAR"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten3],
    [PlanFrequency.Mensual],
    false,
    plan3Id
);

const mockDatabase: Plan[] = [plan1, plan2, plan3];
export const mockPlanRepository: IPlanRepository = new MockPlanRepository(mockDatabase);
