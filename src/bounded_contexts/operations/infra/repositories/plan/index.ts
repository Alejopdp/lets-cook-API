import { Locale } from "../../../domain/locale/Locale";
import { Plan } from "../../../domain/plan/Plan";
import { PlanFrequency } from "../../../domain/plan/PlanFrequency";
import { PlanId } from "../../../domain/plan/PlanId";
import { PlanSku } from "../../../domain/plan/PlanSku";
import { PlanType } from "../../../domain/plan/PlanType/PlanType";
import { PlanVariant } from "../../../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantAttribute } from "../../../domain/plan/PlanVariant/PlanVariantAttribute";
import { PlanVariantWithRecipe } from "../../../domain/plan/PlanVariant/PlanVariantWithRecipes";
import { IPlanRepository } from "./IPlanRepository";
import { MockPlanRepository } from "./mockPlanRepository";
import { MongoosePlanRepository } from "./mongoosePlanRepository";

export const mongoosePlanRepository: MongoosePlanRepository = new MongoosePlanRepository();

const plan1Id: PlanId = new PlanId(1);
const plan2Id: PlanId = new PlanId(2);
const plan3Id: PlanId = new PlanId(3);
const plan4Id: PlanId = new PlanId(4);
const plan5Id: PlanId = new PlanId(5);
const plan6Id: PlanId = new PlanId(6);
const plan7Id: PlanId = new PlanId(7);
const plan8Id: PlanId = new PlanId(8);

const attr1: PlanVariantAttribute = new PlanVariantAttribute("Key 1", "Value 1");
const attr2: PlanVariantAttribute = new PlanVariantAttribute("Key 2", "Value 2");
const attr3: PlanVariantAttribute = new PlanVariantAttribute("Key 2", "Valu 3");

const variantWithoutGluten1 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLFMLNGL1"), "Familiar 1 sin gluten", 30, 20, [attr1, attr2]);
const variantWithoutGlutenAndMilk1 = new PlanVariantWithRecipe(2, 3, new PlanSku("PLFMLNGL1"), "Familiar 1 sin gluten ni lacteos", 35, 25, [
    attr1,
    attr3,
]);
const variantWithoutGluten1bis = new PlanVariantWithRecipe(2, 2, new PlanSku("PLFMLNGL1"), "Familiar 1 sin gluten bis", 3, 2, [
    attr1,
    attr3,
]);
const variantWithoutGlutenAndMilk1bis = new PlanVariantWithRecipe(
    2,
    3,
    new PlanSku("PLFMLNGL1"),
    "Familiar 1 sin gluten ni lacteos bis",
    5,
    3,
    [attr1, attr2]
);
const variantWithoutGluten2 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLVEGNGL1"), "Vegetariano 1 sin gluten", 30, 20, []);
const variantWithoutGluten3 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLCARNGL1"), "Carnívoro 1 sin gluten", 30, 20, []);
const variantWithoutGluten4 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLFMLNGL2"), "Familiar 2 sin gluten", 30, 20, []);
const variantWithoutGluten5 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLVEGNGL2"), "Vegetariano 2 sin gluten", 30, 20, []);
const variantWithoutGluten6 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLCARNGL2"), "Carnívoro 2 sin gluten", 30, 20, []);
const variantWithoutGluten7 = new PlanVariant(new PlanSku("PLCER1"), "", 10, [], 8);
const variantWithoutGluten8 = new PlanVariant(new PlanSku("PLVIN2"), "", 15, [], 12);

export const plan1: Plan = Plan.create(
    "Plan familiar 1",
    "Plan para toda la familia",
    new PlanSku("PLFML1"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten1, variantWithoutGlutenAndMilk1, variantWithoutGluten1bis, variantWithoutGlutenAndMilk1bis],
    [PlanFrequency.Mensual],
    true,
    [],
    Locale.es,
    plan1Id
);
export const plan2: Plan = Plan.create(
    "Plan vegetariano 1",
    "Plan para vegetarianos",
    new PlanSku("PLVEG1"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten2],
    [PlanFrequency.Semanal, PlanFrequency.Quincenal],
    true,
    [],
    Locale.es,
    plan2Id
);
export const plan3: Plan = Plan.create(
    "Plan carnívoro 1",
    "Para los que le gustan los asaditos",
    new PlanSku("PLCAR1"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten3],
    [PlanFrequency.Mensual],
    false,
    [],
    Locale.es,
    plan3Id
);

export const plan4: Plan = Plan.create(
    "Plan familiar 2",
    "Plan para toda la familia",
    new PlanSku("PLFML2"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten4],
    [PlanFrequency.Mensual],
    true,
    [],
    Locale.es,
    plan4Id
);
export const plan5: Plan = Plan.create(
    "Plan vegetariano 2",
    "Plan para vegetarianos",
    new PlanSku("PLVEG2"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten5],
    [PlanFrequency.Semanal, PlanFrequency.Quincenal],
    true,
    [],
    Locale.es,
    plan5Id
);
export const plan6: Plan = Plan.create(
    "Plan carnívoro 2",
    "Para los que le gustan los asaditos",
    new PlanSku("PLCAR2"),
    "",
    true,
    PlanType.Principal,
    [variantWithoutGluten6],
    [PlanFrequency.Mensual],
    false,
    [],
    Locale.es,
    plan6Id
);

export const plan7: Plan = Plan.create(
    "Plan cerveza",
    "Plan para tomar una cervecita",
    new PlanSku("PLCER"),
    "",
    true,
    PlanType.Adicional,
    [variantWithoutGluten7],
    [PlanFrequency.PorUnicaVez],
    false,
    [],
    Locale.es,
    plan7Id
);
export const plan8: Plan = Plan.create(
    "Plan de Vinos",
    "Plan para tomar un vino",
    new PlanSku("PLVIN"),
    "",
    true,
    PlanType.Adicional,
    [variantWithoutGluten8],
    [PlanFrequency.PorUnicaVez],
    false,
    [],
    Locale.es,
    plan8Id
);

const mockDatabase: Plan[] = [plan1, plan2, plan3, plan4, plan5, plan6, plan7, plan8];
export const mockPlanRepository: IPlanRepository = new MockPlanRepository(mockDatabase);
