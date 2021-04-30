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
const plan4Id: PlanId = new PlanId(4);
const plan5Id: PlanId = new PlanId(5);
const plan6Id: PlanId = new PlanId(6);
const plan7Id: PlanId = new PlanId(7);
const plan8Id: PlanId = new PlanId(8);
const plan9Id: PlanId = new PlanId(9);
const plan10Id: PlanId = new PlanId(10);
const plan11Id: PlanId = new PlanId(11);
const plan12Id: PlanId = new PlanId(12);

const variantWithoutGluten1 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLFMLNGL1"), "Familiar 1 sin gluten", 30, 20, []);
const variantWithoutGluten2 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLVEGNGL1"), "Vegetariano 1 sin gluten", 30, 20, []);
const variantWithoutGluten3 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLCARNGL1"), "Carnívoro 1 sin gluten", 30, 20, []);
const variantWithoutGluten4 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLFMLNGL2"), "Familiar 2 sin gluten", 30, 20, []);
const variantWithoutGluten5 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLVEGNGL2"), "Vegetariano 2 sin gluten", 30, 20, []);
const variantWithoutGluten6 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLCARNGL2"), "Carnívoro 2 sin gluten", 30, 20, []);
const variantWithoutGluten7 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLFMLNGL3"), "Familiar 3 sin gluten", 30, 20, []);
const variantWithoutGluten8 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLVEGNGL3"), "Vegetariano 3 sin gluten", 30, 20, []);
const variantWithoutGluten9 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLCARNGL3"), "Carnívoro 3 sin gluten", 30, 20, []);
const variantWithoutGluten10 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLFMLNG4"), "Familiar 4 sin gluten", 30, 20, []);
const variantWithoutGluten11 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLVEGNGL4"), "Vegetariano 4 sin gluten", 30, 20, []);
const variantWithoutGluten12 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLCARNGL4"), "Carnívoro 4 sin gluten", 30, 20, []);

const plan1: Plan = Plan.create(
    "Plan familiar 1",
    "Plan para toda la familia",
    new PlanSku("PLFML1"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten1],
    [PlanFrequency.Mensual],
    true,
    plan1Id
);
const plan2: Plan = Plan.create(
    "Plan vegetariano 1",
    "Plan para vegetarianos",
    new PlanSku("PLVEG1"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten2],
    [PlanFrequency.Semanal, PlanFrequency.Quincenal],
    true,
    plan2Id
);
const plan3: Plan = Plan.create(
    "Plan carnívoro 1",
    "Para los que le gustan los asaditos",
    new PlanSku("PLCAR1"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten3],
    [PlanFrequency.Mensual],
    false,
    plan3Id
);

const plan4: Plan = Plan.create(
    "Plan familiar 2",
    "Plan para toda la familia",
    new PlanSku("PLFML2"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten4],
    [PlanFrequency.Mensual],
    true,
    plan4Id
);
const plan5: Plan = Plan.create(
    "Plan vegetariano 2",
    "Plan para vegetarianos",
    new PlanSku("PLVEG2"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten5],
    [PlanFrequency.Semanal, PlanFrequency.Quincenal],
    true,
    plan5Id
);
const plan6: Plan = Plan.create(
    "Plan carnívoro 2",
    "Para los que le gustan los asaditos",
    new PlanSku("PLCAR2"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten6],
    [PlanFrequency.Mensual],
    false,
    plan6Id
);

const plan7: Plan = Plan.create(
    "Plan familiar 3",
    "Plan para toda la familia",
    new PlanSku("PLFML3"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten7],
    [PlanFrequency.Mensual],
    true,
    plan7Id
);
const plan8: Plan = Plan.create(
    "Plan vegetariano 3",
    "Plan para vegetarianos",
    new PlanSku("PLVEG3"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten8],
    [PlanFrequency.Semanal, PlanFrequency.Quincenal],
    true,
    plan8Id
);
const plan9: Plan = Plan.create(
    "Plan carnívoro 3",
    "Para los que le gustan los asaditos",
    new PlanSku("PLCAR3"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten9],
    [PlanFrequency.Mensual],
    false,
    plan9Id
);

const plan10: Plan = Plan.create(
    "Plan familiar 4",
    "Plan para toda la familia",
    new PlanSku("PLFML4"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten10],
    [PlanFrequency.Mensual],
    true,
    plan10Id
);
const plan11: Plan = Plan.create(
    "Plan vegetariano 4",
    "Plan para vegetarianos",
    new PlanSku("PLVEG4"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten11],
    [PlanFrequency.Semanal, PlanFrequency.Quincenal],
    true,
    plan11Id
);
const plan12: Plan = Plan.create(
    "Plan carnívoro 4",
    "Para los que le gustan los asaditos",
    new PlanSku("PLCAR4"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten12],
    [PlanFrequency.Mensual],
    false,
    plan12Id
);

const mockDatabase: Plan[] = [plan1, plan2, plan3, plan4, plan5, plan6, plan7, plan8, plan9, plan10, plan11, plan12];
export const mockPlanRepository: IPlanRepository = new MockPlanRepository(mockDatabase);
