import { logger } from "../config";
import { Ingredient } from "../src/bounded_contexts/operations/domain/ingredient/ingredient";
import { Locale } from "../src/bounded_contexts/operations/domain/locale/Locale";
import { Plan } from "../src/bounded_contexts/operations/domain/plan/Plan";
import { Month } from "../src/bounded_contexts/operations/domain/recipe/Months";
import { Recipe } from "../src/bounded_contexts/operations/domain/recipe/Recipe";
import { RecipeCookDuration } from "../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/RecipeCookDuration";
import { RecipeDescription } from "../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/RecipeDescription";
import { RecipeDifficultyLevel } from "../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { RecipeGeneralData } from "../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/RecipeGeneralData";
import { RecipeSku } from "../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/RecipeSku";
import { RecipeWeight } from "../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/RecipeWeight";
import { WeightUnit } from "../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/WeightUnit";
import { RecipeNutritionalData } from "../src/bounded_contexts/operations/domain/recipe/RecipeNutritionalData/RecipeNutritionalData";
import { RecipeTag } from "../src/bounded_contexts/operations/domain/recipe/RecipeTag";
import { RecipeVariant } from "../src/bounded_contexts/operations/domain/recipe/RecipeVariant/RecipeVariant";
import { RecipeVariantRestriction } from "../src/bounded_contexts/operations/domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeVariantSku } from "../src/bounded_contexts/operations/domain/recipe/RecipeVariant/RecipeVariantSku";
import { Week } from "../src/bounded_contexts/operations/domain/week/Week";
import { mongoosePlanRepository } from "../src/bounded_contexts/operations/infra/repositories/plan";
import {
    mongooseRecipeVariantRestrictionRepository,
    sinLactosa,
    vegano,
    Vegetariano,
} from "../src/bounded_contexts/operations/infra/repositories/recipeVariantRestriction";
import { mongooseWeekRepository } from "../src/bounded_contexts/operations/infra/repositories/week";

export const getMockRecipes = async (): Promise<Recipe[]> => {
    const weeks: Week[] = await mongooseWeekRepository.findNextEight();
    const plans: Plan[] = await mongoosePlanRepository.findAll(Locale.es);
    const restrictions: RecipeVariantRestriction[] = await mongooseRecipeVariantRestrictionRepository.findAll();

    const lechuga: Ingredient = new Ingredient("Lechuga");
    const tomate: Ingredient = new Ingredient("Tomate");
    const cebolla: Ingredient = new Ingredient("Cebolla");
    const carne: Ingredient = new Ingredient("Carne");
    const pan: Ingredient = new Ingredient("Pan");
    const queso: Ingredient = new Ingredient("Queso");
    const cerdo: Ingredient = new Ingredient("Cerdo");

    const masVendida = new RecipeTag("Mas vendida");
    const masRica = new RecipeTag("Mas rica");

    const tagParaFiltro1 = new RecipeTag("Tag1");
    const tagParaFiltro2 = new RecipeTag("Tag2");

    const burgerHallouliData: RecipeGeneralData = new RecipeGeneralData(
        "Burger de Hallouli",
        new RecipeDescription("Alta hamburguesa", "Alta hamburguesa papá la mejor de todas"),
        new RecipeCookDuration(45),
        RecipeDifficultyLevel.Facil,
        new RecipeWeight(250, WeightUnit.Gram),
        new RecipeSku("BRGH"),
        "development/plans/Plan_test/Plan_test.png"
    );
    const carneBurgerVariant1: RecipeVariant = new RecipeVariant(
        [lechuga, tomate, cebolla, carne, pan, queso],
        [restrictions[0]],
        new RecipeVariantSku("BRGHCAR")
    );
    const cerdoVariant1: RecipeVariant = new RecipeVariant(
        [lechuga, tomate, cebolla, cerdo, pan, queso],
        [restrictions[0]],
        new RecipeVariantSku("BRGHCER")
    );
    const burgerHallouli: Recipe = new Recipe(
        burgerHallouliData,
        [carneBurgerVariant1, cerdoVariant1],
        [masVendida],
        [tagParaFiltro1, tagParaFiltro2],
        new RecipeNutritionalData([]),
        [weeks[0], weeks[1]],
        [Month.Abril, Month.Mayo, Month.Marzo, Month.Agosto],
        [plans[0].id, plans[1].id],
        []
        // burgerRecipeId
    );

    const arepasDeCrhistianData: RecipeGeneralData = new RecipeGeneralData(
        "Arepas de Crhistian",
        new RecipeDescription("Las mejores arepas de Colombia", "Las mejores arepas hechas por el mejor dev de Colombia"),
        new RecipeCookDuration(50),
        RecipeDifficultyLevel.Alta,
        new RecipeWeight(150, WeightUnit.Gram),
        new RecipeSku("ARP"),
        "development/plans/Plan_test/Plan_test.png"
    );
    const simpleArepaVariant: RecipeVariant = new RecipeVariant(
        [pan],
        [restrictions[0]],
        new RecipeVariantSku("ARPVEG")
        // burgerRecipeId
    );
    const completaArepaVariant: RecipeVariant = new RecipeVariant(
        [pan, tomate, lechuga, queso, carne],
        [restrictions[0]],
        new RecipeVariantSku("ARPCAR")
    );
    const arepasDeCrhistian: Recipe = new Recipe(
        arepasDeCrhistianData,
        [simpleArepaVariant, completaArepaVariant],
        [masVendida, masRica],
        [tagParaFiltro1],
        new RecipeNutritionalData([]),
        [weeks[0], weeks[1]],
        [Month.Abril, Month.Mayo, Month.Marzo, Month.Agosto],
        [plans[1].id, plans[2].id],
        []
        // arepasRecipeId
    );

    return [arepasDeCrhistian, burgerHallouli];
};
