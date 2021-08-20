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
import { PlanVariantWithRecipe } from "../src/bounded_contexts/operations/domain/plan/PlanVariant/PlanVariantWithRecipes";

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

    const desayunoVariant1 = new PlanVariantWithRecipe(
        1,
        1,
        new PlanSku("PLDES1"),
        "Desayuno para 1 persona",
        30,
        20,
        [],
        "PLDES1 Desc",
        true,
        false
    );
    const desayunoVariant2 = new PlanVariantWithRecipe(
        2,
        1,
        new PlanSku("PLDES2"),
        "Desayuno para 2 personas",
        30,
        20,
        [],
        "PLDES2 Desc",
        false,
        false
    );

    const desayunoVariant3 = new PlanVariantWithRecipe(
        3,
        1,
        new PlanSku("PLDES3"),
        "Desayuno para 3 personas",
        30,
        20,
        [],
        "PLDES3 Desc",
        false,
        false
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

    const planGourmetVariant2Persons2Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        2,
        new PlanSku("GOUR1"),
        "",
        35.96,
        27.99,
        [],
        "",
        true,
        false
    );
    const planGourmetVariant2Persons3Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        3,
        new PlanSku("GOUR2"),
        "",
        53.94,
        37.99,
        [],
        "",
        false,
        false
    );
    const planGourmetVariant2Persons4Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        4,
        new PlanSku("GOUR3"),
        "",
        71.92,
        47.99,
        [],
        "",
        false,
        false
    );
    const planGourmetVariant2Persons5Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        5,
        new PlanSku("GOUR4"),
        "",
        89.9,
        58.49,
        [],
        "",
        false,
        false
    );
    const planGourmetVariant4Persons2Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        2,
        new PlanSku("GOUR5"),
        "",
        71.92,
        44.99,
        [],
        "",
        false,
        false
    );
    const planGourmetVariant4Persons3Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        3,
        new PlanSku("GOUR6"),
        "",
        107.88,
        62.99,
        [],
        "",
        false,
        false
    );
    const planGourmetVariant4Persons4Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        4,
        new PlanSku("GOUR7"),
        "",
        143.84,
        79.99,
        [],
        "",
        false,
        false
    );
    const planGourmetVariant4Persons5Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        5,
        new PlanSku("GOUR8"),
        "",
        179.8,
        95.99,
        [],
        "",
        false,
        false
    );

    const planAhorroVariant2Persons2Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        2,
        new PlanSku("AHOR1"),
        "",
        35.96,
        24.99,
        [],
        "",
        true,
        false
    );
    const planAhorroVariant2Persons3Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        3,
        new PlanSku("AHOR2"),
        "",
        53.94,
        33.99,
        [],
        "",
        false,
        false
    );
    const planAhorroVariant2Persons4Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        4,
        new PlanSku("AHOR3"),
        "",
        71.92,
        41.99,
        [],
        "",
        false,
        false
    );
    const planAhorroVariant2Persons5Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        5,
        new PlanSku("AHOR4"),
        "",
        89.9,
        50.99,
        [],
        "",
        false,
        false
    );
    const planAhorroVariant4Persons2Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        2,
        new PlanSku("AHOR5"),
        "",
        71.92,
        37.99,
        [],
        "",
        false,
        false
    );
    const planAhorroVariant4Persons3Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        3,
        new PlanSku("AHOR6"),
        "",
        107.88,
        54.99,
        [],
        "",
        false,
        false
    );
    const planAhorroVariant4Persons4Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        4,
        new PlanSku("AHOR7"),
        "",
        143.84,
        70.99,
        [],
        "",
        false,
        false
    );
    const planAhorroVariant4Persons5Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        5,
        new PlanSku("AHOR8"),
        "",
        179.8,
        82.99,
        [],
        "",
        false,
        false
    );

    const planVegetarianoVariant2Persons2Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        2,
        new PlanSku("VEGE1"),
        "",
        35.96,
        26.49,
        [],
        "",
        true,
        false
    );
    const planVegetarianoVariant2Persons3Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        3,
        new PlanSku("VEGE2"),
        "",
        53.94,
        35.99,
        [],
        "",
        false,
        false
    );
    const planVegetarianoVariant2Persons4Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        4,
        new PlanSku("VEGE3"),
        "",
        71.92,
        45.99,
        [],
        "",
        false,
        false
    );
    const planVegetarianoVariant2Persons5Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        5,
        new PlanSku("VEGE4"),
        "",
        89.9,
        54.99,
        [],
        "",
        false,
        false
    );
    const planVegetarianoVariant4Persons2Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        2,
        new PlanSku("VEGE5"),
        "",
        71.92,
        41.99,
        [],
        "",
        false,
        false
    );
    const planVegetarianoVariant4Persons3Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        3,
        new PlanSku("VEGE6"),
        "",
        107.88,
        59.99,
        [],
        "",
        false,
        false
    );
    const planVegetarianoVariant4Persons4Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        4,
        new PlanSku("VEGE7"),
        "",
        143.84,
        75.99,
        [],
        "",
        false,
        false
    );
    const planVegetarianoVariant4Persons5Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        5,
        new PlanSku("VEGE8"),
        "",
        179.8,
        89.99,
        [],
        "",
        false,
        false
    );

    const planVeganoVariant2Persons2Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        2,
        new PlanSku("VEGA1"),
        "",
        35.96,
        27.49,
        [],
        "",
        true,
        false
    );
    const planVeganoVariant2Persons3Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        3,
        new PlanSku("VEGA2"),
        "",
        53.94,
        37.99,
        [],
        "",
        false,
        false
    );
    const planVeganoVariant2Persons4Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        4,
        new PlanSku("VEGA3"),
        "",
        71.92,
        47.99,
        [],
        "",
        false,
        false
    );
    const planVeganoVariant2Persons5Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        5,
        new PlanSku("VEGA4"),
        "",
        89.9,
        58.99,
        [],
        "",
        false,
        false
    );
    const planVeganoVariant4Persons2Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        2,
        new PlanSku("VEGA5"),
        "",
        71.92,
        44.99,
        [],
        "",
        false,
        false
    );
    const planVeganoVariant4Persons3Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        3,
        new PlanSku("VEGA6"),
        "",
        107.88,
        62.99,
        [],
        "",
        false,
        false
    );
    const planVeganoVariant4Persons4Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        4,
        new PlanSku("VEGA7"),
        "",
        143.84,
        79.99,
        [],
        "",
        false,
        false
    );
    const planVeganoVariant4Persons5Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        5,
        new PlanSku("VEGA8"),
        "",
        179.8,
        95.99,
        [],
        "",
        false,
        false
    );

    const planFamiliarVariant2Persons2Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        2,
        new PlanSku("FAMI1"),
        "2 adultos y 1-2 niños 2 recetas",
        53.94,
        34.49,
        [],
        "",
        true,
        false
    );
    const planFamiliarVariant2Persons3Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        3,
        new PlanSku("FAMI2"),
        "2 adultos y 1-2 niños 3 recetas",
        80.91,
        49.99,
        [],
        "",
        false,
        false
    );
    const planFamiliarVariant2Persons4Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        4,
        new PlanSku("FAMI3"),
        "2 adultos y 1-2 niños 4 recetas",
        107.88,
        64.99,
        [],
        "",
        false,
        false
    );
    const planFamiliarVariant2Persons5Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        2,
        5,
        new PlanSku("FAMI4"),
        "2 adultos y 1-2 niños 5 recetas",
        134.85,
        79.99,
        [],
        "",
        false,
        false
    );
    const planFamiliarVariant4Persons2Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        2,
        new PlanSku("FAMI5"),
        "2 adultos y 2-3 niños 2 recetas",
        71.92,
        44.99,
        [],
        "",
        false,
        false
    );
    const planFamiliarVariant4Persons3Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        3,
        new PlanSku("FAMI6"),
        "2 adultos y 2-3 niños 3 recetas",
        107.88,
        62.99,
        [],
        "",
        false,
        false
    );
    const planFamiliarVariant4Persons4Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        4,
        new PlanSku("FAMI7"),
        "2 adultos y 2-3 niños 4 recetas",
        143.84,
        79.99,
        [],
        "",
        false,
        false
    );
    const planFamiliarVariant4Persons5Recipes: PlanVariantWithRecipe = new PlanVariantWithRecipe(
        4,
        5,
        new PlanSku("FAMI8"),
        "2 adultos y 2-3 niños 5 recetas",
        179.8,
        95.99,
        [],
        "",
        false,
        false
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
        [PlanFrequencyFactory.createPlanFrequency("monthly")],
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
        [PlanFrequencyFactory.createPlanFrequency("monthly")],
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

// const plan1: Plan = Plan.create(
//     "Plan Familiar",
//     "Compuesto por recetas deliciosas aprobadas por los niños y que los adultos aman. Cuenta con total libertad para elegir platos equilibrados",
//     new PlanSku("PLFML1"),
//     "development/plan-familiar.webp",
//     true,
//     PlanType.Principal,
//     [variantWithoutGluten1, variantWithoutGlutenAndMilk1, variantWithoutGluten1bis, variantWithoutGlutenAndMilk1bis],
//     [PlanFrequencyFactory.createPlanFrequency("monthly")],
//     true,
//     [additionalPlan1, additionalPlan2],
//     Locale.es,
//     new PlanSlug("Plan Familiar"),
//     true,
//     "development/plan-familiar.svg",
//     "development/plan-familiar-color.svg"
// );

// const plan2: Plan = Plan.create(
//     "Plan Gourmet",
//     "Compuesto por la mejor selección de platos de la cocina nacional e internacional, con total libertad para elegir platos sabrosos y saludables.",
//     new PlanSku("PLVEG1"),
//     "development/plan-gourmet.webp",
//     true,
//     PlanType.Principal,
//     [variantWithoutGluten2, variantWithoutGluten1bis, variantWithoutGlutenAndMilk1bis],
//     [PlanFrequencyFactory.createPlanFrequency("weekly"), PlanFrequencyFactory.createPlanFrequency("biweekly")],
//     true,
//     [additionalPlan1, additionalPlan2],
//     Locale.es,
//     new PlanSlug("Plan Gourmet"),
//     true,
//     "development/plan-gourmet.svg",
//     "development/plan-gourmet-color.svg"
// );

// const plan3: Plan = Plan.create(
//     "Plan Ahorro",
//     "Cuidamos tu bolsillo decidiendo por ti en base a los gustos e intolerancias que avises a la hora de darte de alta.",
//     new PlanSku("PLCAR1"),
//     "development/plan-ahorro.webp",
//     true,
//     PlanType.Principal,
//     [variantWithoutGluten3, variantWithoutGluten1bis, variantWithoutGlutenAndMilk1bis],
//     [PlanFrequencyFactory.createPlanFrequency("monthly")],
//     false,
//     [additionalPlan1],
//     Locale.es,
//     new PlanSlug("Plan Ahorro"),
//     true,
//     "development/plan-ahorro.svg",
//     "development/plan-ahorro-color.svg"
// );

// const plan4: Plan = Plan.create(
//     "Plan Vegetariano",
//     "Incluye una gran diversidad de platos vegetarianos cada semana para poder seguir una dieta rica y variada.",
//     new PlanSku("PLFML2"),
//     "development/plan-vegetariano.webp",
//     true,
//     PlanType.Principal,
//     [variantWithoutGluten4, variantWithoutGluten1bis, variantWithoutGlutenAndMilk1bis],
//     [PlanFrequencyFactory.createPlanFrequency("monthly")],
//     true,
//     [additionalPlan1, additionalPlan2],
//     Locale.es,
//     new PlanSlug("Plan vegetariano"),
//     true,
//     "development/plan-vegetariano.svg",
//     "development/plan-vegetariano-color.svg"
// );

// const plan5: Plan = Plan.create(
//     "Plan Vegano",
//     "Adaptamos las recetas para que puedas tener una dieta 100% a base de plantas, eligiendo cada semana platos ricos y sanos.",
//     new PlanSku("PLFML2"),
//     "development/plan-vegano.webp",
//     true,
//     PlanType.Principal,
//     [variantWithoutGluten5, variantWithoutGluten1bis, variantWithoutGlutenAndMilk1bis],
//     [PlanFrequencyFactory.createPlanFrequency("monthly")],
//     true,
//     [additionalPlan1, additionalPlan2],
//     Locale.es,
//     new PlanSlug("Plan Vegano"),
//     true,
//     "development/plan-vegano.svg",
//     "development/plan-vegano-color.svg"
// );
