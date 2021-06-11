import { Locale } from "../src/bounded_contexts/operations/domain/locale/Locale";
import { Plan } from "../src/bounded_contexts/operations/domain/plan/Plan";
import { PlanFrequency } from "../src/bounded_contexts/operations/domain/plan/PlanFrequency";
import { PlanId } from "../src/bounded_contexts/operations/domain/plan/PlanId";
import { PlanSku } from "../src/bounded_contexts/operations/domain/plan/PlanSku";
import { PlanType } from "../src/bounded_contexts/operations/domain/plan/PlanType/PlanType";
import { PlanVariant } from "../src/bounded_contexts/operations/domain/plan/PlanVariant/PlanVariant";
import { PlanVariantAttribute } from "../src/bounded_contexts/operations/domain/plan/PlanVariant/PlanVariantAttribute";
import { PlanVariantWithRecipe } from "../src/bounded_contexts/operations/domain/plan/PlanVariant/PlanVariantWithRecipes";

export const getMockPlans = () => {
    const attr1: PlanVariantAttribute = new PlanVariantAttribute("Key 1", "Value 1");
    const attr2: PlanVariantAttribute = new PlanVariantAttribute("Key 2", "Value 2");
    const attr3: PlanVariantAttribute = new PlanVariantAttribute("Key 2", "Valu 3");

    const variantWithoutGluten1 = new PlanVariantWithRecipe(2, 2, new PlanSku("PLFMLNGL1"), "Familiar 1 sin gluten", 30, 20, [
        attr1,
        attr2,
    ]);
    const variantWithoutGlutenAndMilk1 = new PlanVariantWithRecipe(
        2,
        3,
        new PlanSku("PLFMLNGL1"),
        "Familiar 1 sin gluten ni lacteos",
        35,
        25,
        [attr1, attr3]
    );
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
    const variantWithoutGluten7 = new PlanVariant(new PlanSku("PLCER1"), "development/plans/Plan_test/Plan_test.png", 10, [], 8);
    const variantWithoutGluten8 = new PlanVariant(new PlanSku("PLVIN2"), "development/plans/Plan_test/Plan_test.png", 15, [], 12);

    const plan1: Plan = Plan.create(
        "Plan familiar 1",
        "Plan para toda la familia",
        new PlanSku("PLFML1"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Principal,
        [variantWithoutGluten1, variantWithoutGlutenAndMilk1, variantWithoutGluten1bis, variantWithoutGlutenAndMilk1bis],
        [PlanFrequency.Mensual],
        true,
        [],
        Locale.es
    );

    const plan2: Plan = Plan.create(
        "Plan vegetariano 1",
        "Plan para vegetarianos",
        new PlanSku("PLVEG1"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Principal,
        [variantWithoutGluten2],
        [PlanFrequency.Semanal, PlanFrequency.Quincenal],
        true,
        [],
        Locale.es
    );

    const plan3: Plan = Plan.create(
        "Plan carnívoro 1",
        "Para los que le gustan los asaditos",
        new PlanSku("PLCAR1"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Principal,
        [variantWithoutGluten3],
        [PlanFrequency.Mensual],
        false,
        [],
        Locale.es
    );

    const plan4: Plan = Plan.create(
        "Plan familiar 2",
        "Plan para toda la familia",
        new PlanSku("PLFML2"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Principal,
        [variantWithoutGluten4],
        [PlanFrequency.Mensual],
        true,
        [],
        Locale.es
    );

    const plan5: Plan = Plan.create(
        "Plan vegetariano 2",
        "Plan para vegetarianos",
        new PlanSku("PLVEG2"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Principal,
        [variantWithoutGluten5],
        [PlanFrequency.Semanal, PlanFrequency.Quincenal],
        true,
        [],
        Locale.es
    );

    const plan6: Plan = Plan.create(
        "Plan carnívoro 2",
        "Para los que le gustan los asaditos",
        new PlanSku("PLCAR2"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Principal,
        [variantWithoutGluten6],
        [PlanFrequency.Mensual],
        false,
        [],
        Locale.es
    );

    const plan7: Plan = Plan.create(
        "Plan cerveza",
        "Plan para tomar una cervecita",
        new PlanSku("PLCER"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Adicional,
        [variantWithoutGluten7],
        [PlanFrequency.PorUnicaVez],
        false,
        [],
        Locale.es
    );

    const plan8: Plan = Plan.create(
        "Plan de Vinos",
        "Plan para tomar un vino",
        new PlanSku("PLVIN"),
        "development/plans/Plan_test/Plan_test.png",
        true,
        PlanType.Adicional,
        [variantWithoutGluten8],
        [PlanFrequency.PorUnicaVez],
        false,
        [],
        Locale.es
    );

    return [plan1, plan2, plan3, plan4, plan5, plan6, plan7, plan8];
};
