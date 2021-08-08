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

    const variantWithoutGluten1 = new PlanVariantWithRecipe(
        2,
        2,
        new PlanSku("PLFMLNGL1"),
        "Familiar 1 sin gluten",
        30,
        20,
        [attr1, attr2],
        "PLVEGNGL1 Desc",
        true
    );
    const variantWithoutGlutenAndMilk1 = new PlanVariantWithRecipe(
        2,
        3,
        new PlanSku("PLFMLNGL1"),
        "Familiar 1 sin gluten ni lacteos",
        35,
        25,
        [attr1, attr3],
        "PLVEGNGL1 Desc",
        false
    );
    const variantWithoutGluten1bis = new PlanVariantWithRecipe(
        2,
        2,
        new PlanSku("PLFMLNGL1"),
        "Familiar 1 sin gluten bis",
        3,
        2,
        [attr1, attr3],
        "PLVEGNGL1 Desc",
        false
    );
    const variantWithoutGlutenAndMilk1bis = new PlanVariantWithRecipe(
        2,
        3,
        new PlanSku("PLFMLNGL1"),
        "Familiar 1 sin gluten ni lacteos bis",
        5,
        3,
        [attr1, attr2],
        "PLVEGNGL1 Desc",
        false
    );

    const variantWithoutGluten2 = new PlanVariantWithRecipe(
        2,
        2,
        new PlanSku("PLVEGNGL1"),
        "Vegetariano 1 sin gluten",
        30,
        20,
        [],
        "PLVEGNGL1 Desc",
        true
    );
    const variantWithoutGluten3 = new PlanVariantWithRecipe(
        2,
        2,
        new PlanSku("PLCARNGL1"),
        "Carnívoro 1 sin gluten",
        30,
        20,
        [],
        "PLCARNGL1 Desc",
        true
    );
    const variantWithoutGluten4 = new PlanVariantWithRecipe(
        2,
        2,
        new PlanSku("PLFMLNGL2"),
        "Familiar 2 sin gluten",
        30,
        20,
        [],
        "PLFMLNGL2 Desc",
        true
    );
    const variantWithoutGluten5 = new PlanVariantWithRecipe(
        2,
        2,
        new PlanSku("PLVEGNGL2"),
        "Vegetariano 2 sin gluten",
        30,
        20,
        [],
        "PLVEGNGL2 Desc",
        true
    );

    const vinoVariant1 = new PlanVariant(
        new PlanSku("PLVIBLANCO"),
        "Vino blanco",
        10,
        [new PlanVariantAttribute("Tipo", "Blanco")],
        "",
        true
    );
    const vinoVariant2 = new PlanVariant(
        new PlanSku("PLVITINTO"),
        "Vino tinto",
        10,
        [new PlanVariantAttribute("Tipo", "Tinto")],
        "",
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
        true
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
        true
    );

    const additionalPlan1: Plan = Plan.create(
        "Plan Vinos",
        "Plan para acompañar con un vino",
        new PlanSku("PLVI1"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Adicional,
        [vinoVariant1, vinoVariant2],
        [PlanFrequencyFactory.createPlanFrequency("one_time"), PlanFrequencyFactory.createPlanFrequency("weekly")],
        true,
        [],
        Locale.es,
        new PlanSlug("Plan Vinos"),
        true,
        "development/plan-familiar.svg",
        "development/plan-familiar-color.svg"
    );

    const additionalPlan2: Plan = Plan.create(
        "Plan Desayuno",
        "Plan para desayunar",
        new PlanSku("PLDES"),
        "development/plans/Plan_test/Plan_test.png",
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

    const plan1: Plan = Plan.create(
        "Plan Familiar",
        "Plan para toda la familia",
        new PlanSku("PLFML1"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Principal,
        [variantWithoutGluten1, variantWithoutGlutenAndMilk1, variantWithoutGluten1bis, variantWithoutGlutenAndMilk1bis],
        [PlanFrequencyFactory.createPlanFrequency("monthly")],
        true,
        [additionalPlan1, additionalPlan2],
        Locale.es,
        new PlanSlug("Plan Familiar"),
        true,
        "development/plan-familiar.svg",
        "development/plan-familiar-color.svg"
    );

    const plan2: Plan = Plan.create(
        "Plan Gourmet",
        "Plan gourmet",
        new PlanSku("PLVEG1"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Principal,
        [variantWithoutGluten2, variantWithoutGluten1bis, variantWithoutGlutenAndMilk1bis],
        [PlanFrequencyFactory.createPlanFrequency("weekly"), PlanFrequencyFactory.createPlanFrequency("biweekly")],
        true,
        [additionalPlan1, additionalPlan2],
        Locale.es,
        new PlanSlug("Plan Gourmet"),
        true,
        "plan-gourmet.svg",
        "plan-gourmet-color.svg"
    );

    const plan3: Plan = Plan.create(
        "Plan Ahorro",
        "Plan ahorro",
        new PlanSku("PLCAR1"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Principal,
        [variantWithoutGluten3, variantWithoutGluten1bis, variantWithoutGlutenAndMilk1bis],
        [PlanFrequencyFactory.createPlanFrequency("monthly")],
        false,
        [additionalPlan1],
        Locale.es,
        new PlanSlug("Plan Ahorro"),
        true,
        "plan-ahorro.svg",
        "plan-ahorro-color.svg"
    );

    const plan4: Plan = Plan.create(
        "Plan Vegetariano",
        "Plan Vegetariano",
        new PlanSku("PLFML2"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Principal,
        [variantWithoutGluten4, variantWithoutGluten1bis, variantWithoutGlutenAndMilk1bis],
        [PlanFrequencyFactory.createPlanFrequency("monthly")],
        true,
        [additionalPlan1, additionalPlan2],
        Locale.es,
        new PlanSlug("Plan vegetariano"),
        true,
        "plan-vegetariano.svg",
        "plan-vegetariano-color.svg"
    );

    const plan5: Plan = Plan.create(
        "Plan Vegano",
        "Plan Vegano",
        new PlanSku("PLFML2"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Principal,
        [variantWithoutGluten5, variantWithoutGluten1bis, variantWithoutGlutenAndMilk1bis],
        [PlanFrequencyFactory.createPlanFrequency("monthly")],
        true,
        [additionalPlan1, additionalPlan2],
        Locale.es,
        new PlanSlug("Plan Vegano"),
        true,
        "plan-vegano.svg",
        "plan-vegano-color.svg"
    );

    return [plan1, plan2, plan3, plan4, plan5, additionalPlan1, additionalPlan2];
};
