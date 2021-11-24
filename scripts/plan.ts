import { Locale } from "../src/bounded_contexts/operations/domain/locale/Locale";
import { Plan } from "../src/bounded_contexts/operations/domain/plan/Plan";
import { PlanFrequency } from "../src/bounded_contexts/operations/domain/plan/PlanFrequency";
import { PlanFrequencyFactory } from "../src/bounded_contexts/operations/domain/plan/PlanFrequency/PlanFrequencyFactory";
import { PlanId } from "../src/bounded_contexts/operations/domain/plan/PlanId";
import { PlanSku } from "../src/bounded_contexts/operations/domain/plan/PlanSku";
import { PlanSlug } from "../src/bounded_contexts/operations/domain/plan/PlanSlug";
import { PlanType } from "../src/bounded_contexts/operations/domain/plan/PlanType/PlanType";
import { PlanVariant } from "../src/bounded_contexts/operations/domain/plan/PlanVariant/PlanVariant";
import { PlanVariantAttribute } from "../src/bounded_contexts/operations/domain/plan/PlanVariant/PlanVariantAttribute";

export const getMockPlans = () => {
    const attr1: PlanVariantAttribute = new PlanVariantAttribute("Key 1", "Value 1");
    const attr2: PlanVariantAttribute = new PlanVariantAttribute("Key 2", "Value 2");
    const attr3: PlanVariantAttribute = new PlanVariantAttribute("Key 2", "Valu 3");

    const vinoVariant1 = new PlanVariant(
        new PlanSku("PLVIBLANCO"),
        "Vino blanco",
        10,
        [new PlanVariantAttribute("Tipo", "Blanco")],
        "",
        true,
        false
    );
    const vinoVariant2 = new PlanVariant(
        new PlanSku("PLVITINTO"),
        "Vino tinto",
        10,
        [new PlanVariantAttribute("Tipo", "Tinto")],
        "",
        false,
        false
    );

    const desayunoVariant1 = new PlanVariant(
        new PlanSku("PLDES1"),
        "Desayuno para 1 persona",
        30,
        [],
        "PLDES1 Desc",
        true,
        false,
        20,
        undefined,
        1,
        1
    );
    const desayunoVariant2 = new PlanVariant(
        new PlanSku("PLDES2"),
        "Desayuno para 2 personas",
        30,
        [],
        "PLDES2 Desc",
        false,
        false,
        20,
        undefined,
        2,
        1
    );

    const desayunoVariant3 = new PlanVariant(
        new PlanSku("PLDES3"),
        "Desayuno para 3 personas",
        30,
        [],
        "PLDES3 Desc",
        false,
        false,
        20,
        undefined,
        3,
        1
    );

    const additionalPlan1: Plan = Plan.create(
        "Plan Vinos",
        "Plan para acompañar con un vino",
        new PlanSku("PLVI1"),
        "development/plan-test-image.jpg",
        true,
        PlanType.Adicional,
        [vinoVariant1, vinoVariant2],
        [PlanFrequencyFactory.createPlanFrequency("one_time"), PlanFrequencyFactory.createPlanFrequency("weekly")],
        false,
        [],
        Locale.es,
        new PlanSlug("Plan Vinos"),
        false,
        "development/plan-familiar.svg",
        "development/plan-familiar-color.svg"
    );

    const additionalPlan2: Plan = Plan.create(
        "Plan Desayuno",
        "Plan para desayunar",
        new PlanSku("PLDES"),
        "development/plan-test-image.jpg",
        true,
        PlanType.Adicional,
        [desayunoVariant1, desayunoVariant2, desayunoVariant3],
        [
            PlanFrequencyFactory.createPlanFrequency("one_time"),
            PlanFrequencyFactory.createPlanFrequency("weekly"),
            PlanFrequencyFactory.createPlanFrequency("biweekly"),
            PlanFrequencyFactory.createPlanFrequency("monthly"),
        ],
        true,
        [],
        Locale.es,
        new PlanSlug("Plan Desayuno"),
        true,
        "development/plan-familiar.svg",
        "development/plan-familiar-color.svg"
    );

    const planGourmetVariant2Persons2Recipes: PlanVariant = new PlanVariant(
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
    );
    const planGourmetVariant2Persons3Recipes: PlanVariant = new PlanVariant(
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
    );
    const planGourmetVariant2Persons4Recipes: PlanVariant = new PlanVariant(
        new PlanSku("GOUR3"),
        "",
        71.92,
        [],
        "",
        false,
        false,
        47.99,
        undefined,
        2,
        4
    );
    const planGourmetVariant2Persons5Recipes: PlanVariant = new PlanVariant(
        new PlanSku("GOUR4"),
        "",
        89.9,
        [],
        "",
        false,
        false,
        58.49,
        undefined,
        2,
        5
    );
    const planGourmetVariant4Persons2Recipes: PlanVariant = new PlanVariant(
        new PlanSku("GOUR5"),
        "",
        71.92,
        [],
        "",
        false,
        false,
        44.99,
        undefined,
        4,
        2
    );
    const planGourmetVariant4Persons3Recipes: PlanVariant = new PlanVariant(
        new PlanSku("GOUR6"),
        "",
        107.88,
        [],
        "",
        false,
        false,
        62.99,
        undefined,
        4,
        3
    );
    const planGourmetVariant4Persons4Recipes: PlanVariant = new PlanVariant(
        new PlanSku("GOUR7"),
        "",
        143.84,
        [],
        "",
        false,
        false,
        79.99,
        undefined,
        4,
        4
    );
    const planGourmetVariant4Persons5Recipes: PlanVariant = new PlanVariant(
        new PlanSku("GOUR8"),
        "",
        179.8,
        [],
        "",
        false,
        false,
        95.99,
        undefined,
        4,
        5
    );

    const planAhorroVariant2Persons2Recipes: PlanVariant = new PlanVariant(
        new PlanSku("AHOR1"),
        "",
        35.96,
        [],
        "",
        true,
        false,
        24.99,
        undefined,
        2,
        2
    );
    const planAhorroVariant2Persons3Recipes: PlanVariant = new PlanVariant(
        new PlanSku("AHOR2"),
        "",
        53.94,
        [],
        "",
        false,
        false,
        33.99,
        undefined,
        2,
        3
    );
    const planAhorroVariant2Persons4Recipes: PlanVariant = new PlanVariant(
        new PlanSku("AHOR3"),
        "",
        71.92,
        [],
        "",
        false,
        false,
        41.99,
        undefined,
        2,
        4
    );
    const planAhorroVariant2Persons5Recipes: PlanVariant = new PlanVariant(
        new PlanSku("AHOR4"),
        "",
        89.9,
        [],
        "",
        false,
        false,
        50.99,
        undefined,
        2,
        5
    );
    const planAhorroVariant4Persons2Recipes: PlanVariant = new PlanVariant(
        new PlanSku("AHOR5"),
        "",
        71.92,
        [],
        "",
        false,
        false,
        37.99,
        undefined,
        4,
        2
    );
    const planAhorroVariant4Persons3Recipes: PlanVariant = new PlanVariant(
        new PlanSku("AHOR6"),
        "",
        107.88,
        [],
        "",
        false,
        false,
        54.99,
        undefined,
        4,
        3
    );
    const planAhorroVariant4Persons4Recipes: PlanVariant = new PlanVariant(
        new PlanSku("AHOR7"),
        "",
        143.84,
        [],
        "",
        false,
        false,
        70.99,
        undefined,
        4,
        4
    );
    const planAhorroVariant4Persons5Recipes: PlanVariant = new PlanVariant(
        new PlanSku("AHOR8"),
        "",
        179.8,
        [],
        "",
        false,
        false,
        82.99,
        undefined,
        4,
        5
    );

    const planVegetarianoVariant2Persons2Recipes: PlanVariant = new PlanVariant(
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
    const planVegetarianoVariant2Persons3Recipes: PlanVariant = new PlanVariant(
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
    const planVegetarianoVariant2Persons4Recipes: PlanVariant = new PlanVariant(
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
    const planVegetarianoVariant2Persons5Recipes: PlanVariant = new PlanVariant(
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
    const planVegetarianoVariant4Persons2Recipes: PlanVariant = new PlanVariant(
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
    const planVegetarianoVariant4Persons3Recipes: PlanVariant = new PlanVariant(
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
    const planVegetarianoVariant4Persons4Recipes: PlanVariant = new PlanVariant(
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
    const planVegetarianoVariant4Persons5Recipes: PlanVariant = new PlanVariant(
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

    const planVeganoVariant2Persons2Recipes: PlanVariant = new PlanVariant(
        new PlanSku("VEGA1"),
        "",
        35.96,
        [],
        "",
        true,
        false,
        27.49,
        undefined,
        2,
        2
    );
    const planVeganoVariant2Persons3Recipes: PlanVariant = new PlanVariant(
        new PlanSku("VEGA2"),
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
    );
    const planVeganoVariant2Persons4Recipes: PlanVariant = new PlanVariant(
        new PlanSku("VEGA3"),
        "",
        71.92,
        [],
        "",
        false,
        false,
        47.99,
        undefined,
        2,
        4
    );
    const planVeganoVariant2Persons5Recipes: PlanVariant = new PlanVariant(
        new PlanSku("VEGA4"),
        "",
        89.9,
        [],
        "",
        false,
        false,
        58.99,
        undefined,
        2,
        5
    );
    const planVeganoVariant4Persons2Recipes: PlanVariant = new PlanVariant(
        new PlanSku("VEGA5"),
        "",
        71.92,
        [],
        "",
        false,
        false,
        44.99,
        undefined,
        4,
        2
    );
    const planVeganoVariant4Persons3Recipes: PlanVariant = new PlanVariant(
        new PlanSku("VEGA6"),
        "",
        107.88,
        [],
        "",
        false,
        false,
        62.99,
        undefined,
        4,
        3
    );
    const planVeganoVariant4Persons4Recipes: PlanVariant = new PlanVariant(
        new PlanSku("VEGA7"),
        "",
        143.84,
        [],
        "",
        false,
        false,
        79.99,
        undefined,
        4,
        4
    );
    const planVeganoVariant4Persons5Recipes: PlanVariant = new PlanVariant(
        new PlanSku("VEGA8"),
        "",
        179.8,
        [],
        "",
        false,
        false,
        95.99,
        undefined,
        4,
        5
    );

    const planFamiliarVariant2Persons2Recipes: PlanVariant = new PlanVariant(
        new PlanSku("FAMI1"),
        "2 adultos y 1-2 niños 2 recetas",
        53.94,
        [],
        "",
        true,
        false,
        34.49,
        undefined,
        2,
        2
    );
    const planFamiliarVariant2Persons3Recipes: PlanVariant = new PlanVariant(
        new PlanSku("FAMI2"),
        "2 adultos y 1-2 niños 3 recetas",
        80.91,
        [],
        "",
        false,
        false,
        49.99,
        undefined,
        2,
        3
    );
    const planFamiliarVariant2Persons4Recipes: PlanVariant = new PlanVariant(
        new PlanSku("FAMI3"),
        "2 adultos y 1-2 niños 4 recetas",
        107.88,
        [],
        "",
        false,
        false,
        64.99,
        undefined,
        2,
        4
    );
    const planFamiliarVariant2Persons5Recipes: PlanVariant = new PlanVariant(
        new PlanSku("FAMI4"),
        "2 adultos y 1-2 niños 5 recetas",
        134.85,
        [],
        "",
        false,
        false,
        79.99,
        undefined,
        2,
        5
    );
    const planFamiliarVariant4Persons2Recipes: PlanVariant = new PlanVariant(
        new PlanSku("FAMI5"),
        "2 adultos y 2-3 niños 2 recetas",
        71.92,
        [],
        "",
        false,
        false,
        44.99,
        undefined,
        4,
        2
    );
    const planFamiliarVariant4Persons3Recipes: PlanVariant = new PlanVariant(
        new PlanSku("FAMI6"),
        "2 adultos y 2-3 niños 3 recetas",
        107.88,
        [],
        "",
        false,
        false,
        62.99,
        undefined,
        4,
        3
    );
    const planFamiliarVariant4Persons4Recipes: PlanVariant = new PlanVariant(
        new PlanSku("FAMI7"),
        "2 adultos y 2-3 niños 4 recetas",
        143.84,
        [],
        "",
        false,
        false,
        79.99,
        undefined,
        4,
        4
    );
    const planFamiliarVariant4Persons5Recipes: PlanVariant = new PlanVariant(
        new PlanSku("FAMI8"),
        "2 adultos y 2-3 niños 5 recetas",
        179.8,
        [],
        "",
        false,
        false,
        95.99,
        undefined,
        4,
        5
    );

    const planGourmet: Plan = Plan.create(
        "Plan Gourmet",
        "Compuesto por la mejor selección de platos de la cocina nacional e internacional, con total libertad para elegir platos sabrosos y saludables.",
        new PlanSku("PLGOUR"),
        "development/plan-gourmet.jpg",
        true,
        PlanType.Principal,
        [
            planGourmetVariant2Persons2Recipes,
            planGourmetVariant2Persons3Recipes,
            planGourmetVariant2Persons4Recipes,
            planGourmetVariant2Persons5Recipes,
            planGourmetVariant4Persons2Recipes,
            planGourmetVariant4Persons3Recipes,
            planGourmetVariant4Persons4Recipes,
            planGourmetVariant4Persons5Recipes,
        ],
        [PlanFrequencyFactory.createPlanFrequency("weekly"), PlanFrequencyFactory.createPlanFrequency("biweekly")],
        true,
        [additionalPlan1, additionalPlan2],
        Locale.es,
        new PlanSlug("Plan Gourmet"),
        true,
        "development/plan-gourmet.svg",
        "development/plan-gourmet-color.svg"
    );

    const planAhorro: Plan = Plan.create(
        "Plan Ahorro",
        "Cuidamos tu bolsillo decidiendo por ti en base a los gustos e intolerancias que avises a la hora de darte de alta.",
        new PlanSku("PLAHOR"),
        "development/plan-ahorro.jpg",
        true,
        PlanType.Principal,
        [
            planAhorroVariant2Persons2Recipes,
            planAhorroVariant2Persons3Recipes,
            planAhorroVariant2Persons4Recipes,
            planAhorroVariant2Persons5Recipes,
            planAhorroVariant4Persons2Recipes,
            planAhorroVariant4Persons3Recipes,
            planAhorroVariant4Persons4Recipes,
            planAhorroVariant4Persons5Recipes,
        ],
        [PlanFrequencyFactory.createPlanFrequency("weekly")],
        true,
        [additionalPlan1],
        Locale.es,
        new PlanSlug("Plan Ahorro"),
        false,
        "development/plan-ahorro.svg",
        "development/plan-ahorro-color.svg"
    );

    const planVegetariano: Plan = Plan.create(
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
        [additionalPlan1, additionalPlan2],
        Locale.es,
        new PlanSlug("Plan vegetariano"),
        true,
        "development/plan-vegetariano.svg",
        "development/plan-vegetariano-color.svg"
    );

    const planVegano: Plan = Plan.create(
        "Plan Vegano",
        "Adaptamos las recetas para que puedas tener una dieta 100% a base de plantas, eligiendo cada semana platos ricos y sanos.",
        new PlanSku("PLFML2"),
        "development/plan-vegano.jpg",
        true,
        PlanType.Principal,
        [
            planVeganoVariant2Persons2Recipes,
            planVeganoVariant2Persons3Recipes,
            planVeganoVariant2Persons4Recipes,
            planVeganoVariant2Persons5Recipes,
            planVeganoVariant4Persons2Recipes,
            planVeganoVariant4Persons3Recipes,
            planVeganoVariant4Persons4Recipes,
            planVeganoVariant4Persons5Recipes,
        ],
        [PlanFrequencyFactory.createPlanFrequency("weekly"), PlanFrequencyFactory.createPlanFrequency("monthly")],
        true,
        [additionalPlan1, additionalPlan2],
        Locale.es,
        new PlanSlug("Plan Vegano"),
        true,
        "development/plan-vegano.svg",
        "development/plan-vegano-color.svg"
    );

    const planFamiliar: Plan = Plan.create(
        "Plan Familiar",
        "Compuesto por recetas deliciosas aprobadas por los niños y que los adultos aman. Cuenta con total libertad para elegir platos equilibrados",
        new PlanSku("PLFML1"),
        "development/plan-familiar.jpg",
        true,
        PlanType.Principal,
        [
            planFamiliarVariant2Persons2Recipes,
            planFamiliarVariant2Persons3Recipes,
            planFamiliarVariant2Persons4Recipes,
            planFamiliarVariant2Persons5Recipes,
            planFamiliarVariant4Persons2Recipes,
            planFamiliarVariant4Persons3Recipes,
            planFamiliarVariant4Persons4Recipes,
            planFamiliarVariant4Persons5Recipes,
        ],
        [PlanFrequencyFactory.createPlanFrequency("monthly"), PlanFrequencyFactory.createPlanFrequency("weekly")],
        true,
        [additionalPlan1, additionalPlan2],
        Locale.es,
        new PlanSlug("Plan Familiar"),
        true,
        "development/plan-familiar.svg",
        "development/plan-familiar-color.svg"
    );

    return [planGourmet, planVegetariano, planFamiliar, planVegano, planAhorro, additionalPlan1, additionalPlan2];
};
