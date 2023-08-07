import { Locale } from "../../src/bounded_contexts/operations/domain/locale/Locale"
import { Plan } from "../../src/bounded_contexts/operations/domain/plan/Plan"
import { PlanFrequencyFactory } from "../../src/bounded_contexts/operations/domain/plan/PlanFrequency/PlanFrequencyFactory"
import { PlanId } from "../../src/bounded_contexts/operations/domain/plan/PlanId"
import { PlanSku } from "../../src/bounded_contexts/operations/domain/plan/PlanSku"
import { PlanSlug } from "../../src/bounded_contexts/operations/domain/plan/PlanSlug"
import { PlanType } from "../../src/bounded_contexts/operations/domain/plan/PlanType/PlanType"
import { PlanVariant } from "../../src/bounded_contexts/operations/domain/plan/PlanVariant/PlanVariant"

const gourmetPlanSlug = new PlanSlug("plan-gourmet")
export const planGourmetVariant2Persons2Recipes: PlanVariant = new PlanVariant(
    new PlanSku("GOUR1"),
    "",
    35.96,
    [],
    "",
    true,
    false,
    27.99,
    undefined,
    2,
    2
)
export const planGourmetVariant2Persons3Recipes: PlanVariant = new PlanVariant(
    new PlanSku("GOUR2"),
    "",
    53.94,
    [],
    "",
    false,
    false,
    37.99,
    undefined,
    2,
    3
)
const gourmetPlanId = new PlanId()
export const gourmetPlanSku = new PlanSku("PlanGourmet")
export const gourmetPlan = Plan.create("Plan Gourmet", "Plan Gourmet Description", gourmetPlanSku, "", true, PlanType.Principal, [planGourmetVariant2Persons2Recipes, planGourmetVariant2Persons3Recipes], [PlanFrequencyFactory.createPlanFrequency("weekly"), PlanFrequencyFactory.createPlanFrequency("biweekly")], true, [], Locale.es, gourmetPlanSlug, true, "", "", gourmetPlanId, true)


export const planVegetarianoVariant2Persons2Recipes: PlanVariant = new PlanVariant(
    new PlanSku("VEGE1"),
    "",
    35.96,
    [],
    "",
    true,
    false,
    26.49,
    undefined,
    2,
    2
);
export const planVegetarianoVariant2Persons3Recipes: PlanVariant = new PlanVariant(
    new PlanSku("VEGE2"),
    "",
    53.94,
    [],
    "",
    false,
    false,
    35.99,
    undefined,
    2,
    3
);
export const planVegetarianoVariant2Persons4Recipes: PlanVariant = new PlanVariant(
    new PlanSku("VEGE3"),
    "",
    71.92,
    [],
    "",
    false,
    false,
    45.99,
    undefined,
    2,
    4
);
export const planVegetarianoVariant2Persons5Recipes: PlanVariant = new PlanVariant(
    new PlanSku("VEGE4"),
    "",
    89.9,
    [],
    "",
    false,
    false,
    54.99,
    undefined,
    2,
    5
);
export const planVegetarianoVariant4Persons2Recipes: PlanVariant = new PlanVariant(
    new PlanSku("VEGE5"),
    "",
    71.92,
    [],
    "",
    false,
    false,
    41.99,
    undefined,
    4,
    2
);
export const planVegetarianoVariant4Persons3Recipes: PlanVariant = new PlanVariant(
    new PlanSku("VEGE6"),
    "",
    107.88,
    [],
    "",
    false,
    false,
    59.99,
    undefined,
    4,
    3
);
export const planVegetarianoVariant4Persons4Recipes: PlanVariant = new PlanVariant(
    new PlanSku("VEGE7"),
    "",
    143.84,
    [],
    "",
    false,
    false,
    75.99,
    undefined,
    4,
    4
);
export const planVegetarianoVariant4Persons5Recipes: PlanVariant = new PlanVariant(
    new PlanSku("VEGE8"),
    "",
    179.8,
    [],
    "",
    false,
    false,
    89.99,
    undefined,
    4,
    5
);

export const planVegetariano: Plan = Plan.create(
    "Plan Vegetariano",
    "Incluye una gran diversidad de platos vegetarianos cada semana para poder seguir una dieta rica y variada.",
    new PlanSku("PLVEGE"),
    "development/plan-vegetariano.jpg",
    true,
    PlanType.Principal,
    [
        planVegetarianoVariant2Persons2Recipes,
        planVegetarianoVariant2Persons3Recipes,
        planVegetarianoVariant2Persons4Recipes,
        planVegetarianoVariant2Persons5Recipes,
        planVegetarianoVariant4Persons2Recipes,
        planVegetarianoVariant4Persons3Recipes,
        planVegetarianoVariant4Persons4Recipes,
        planVegetarianoVariant4Persons5Recipes,
    ],
    [PlanFrequencyFactory.createPlanFrequency("weekly")],
    true,
    [],
    Locale.es,
    new PlanSlug("Plan vegetariano"),
    true,
    "development/plan-vegetariano.svg",
    "development/plan-vegetariano-color.svg"
);