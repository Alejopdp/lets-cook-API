import { Ingredient } from "../../../domain/ingredient/ingredient";
import { Month } from "../../../domain/recipe/Months";
import { Recipe } from "../../../domain/recipe/Recipe";
import { RecipeCookDuration } from "../../../domain/recipe/RecipeGeneralData/RecipeCookDuration";
import { RecipeDescription } from "../../../domain/recipe/RecipeGeneralData/RecipeDescription";
import { RecipeDifficultyLevel } from "../../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { RecipeGeneralData } from "../../../domain/recipe/RecipeGeneralData/RecipeGeneralData";
import { RecipeSku } from "../../../domain/recipe/RecipeGeneralData/RecipeSku";
import { RecipeWeight } from "../../../domain/recipe/RecipeGeneralData/RecipeWeight";
import { WeightUnit } from "../../../domain/recipe/RecipeGeneralData/WeightUnit";
import { RecipeId } from "../../../domain/recipe/RecipeId";
import { RecipeNutritionalData } from "../../../domain/recipe/RecipeNutritionalData/RecipeNutritionalData";
import { RecipeTag } from "../../../domain/recipe/RecipeTag";
import { RecipeVariant } from "../../../domain/recipe/RecipeVariant/RecipeVariant";
import { RecipeVariantRestriction } from "../../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";
import { RecipeVariantSku } from "../../../domain/recipe/RecipeVariant/RecipeVariantSku";
import { week1, week2 } from "../week";
import { IRecipeRepository } from "./IRecipeRepository";
import { MockRecipeRepository } from "./mockRecipeRepository";
import { plan1, plan2 } from "../plan";
import { sinLactosa, vegano, Vegetariano } from "../recipeVariantRestriction";

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

// const burgerRecipeId = new RecipeId(1);
// const arepasRecipeId = new RecipeId(2);

const burgerHallouliData: RecipeGeneralData = new RecipeGeneralData(
    "Burger de Hallouli",
    new RecipeDescription("Alta hamburguesa", "Alta hamburguesa papá la mejor de todas"),
    new RecipeCookDuration(45),
    RecipeDifficultyLevel.Easy,
    new RecipeWeight(250, WeightUnit.Gram),
    new RecipeSku("BRGH"),
    ""
);
const carneBurgerVariant1: RecipeVariant = new RecipeVariant(
    [lechuga, tomate, cebolla, carne, pan, queso],
    [],
    new RecipeVariantSku("BRGHCAR")
);
const cerdoVariant1: RecipeVariant = new RecipeVariant([lechuga, tomate, cebolla, cerdo, pan, queso], [], new RecipeVariantSku("BRGHCER"));
const burgerHallouli: Recipe = new Recipe(
    burgerHallouliData,
    [carneBurgerVariant1, cerdoVariant1],
    [masVendida],
    [tagParaFiltro1, tagParaFiltro2],
    new RecipeNutritionalData([]),
    [week1, week2],
    [Month.Abril, Month.Mayo, Month.Marzo, Month.Agosto],
    [plan1.id],
    []
    // burgerRecipeId
);

const arepasDeCrhistianData: RecipeGeneralData = new RecipeGeneralData(
    "Arepas de Crhistian",
    new RecipeDescription("Las mejores arepas de Colombia", "Las mejores arepas hechas por el mejor dev de Colombia"),
    new RecipeCookDuration(50),
    RecipeDifficultyLevel.Hard,
    new RecipeWeight(150, WeightUnit.Gram),
    new RecipeSku("ARP"),
    ""
);
const simpleArepaVariant: RecipeVariant = new RecipeVariant(
    [pan],
    [sinLactosa, Vegetariano, vegano],
    new RecipeVariantSku("ARPVEG")
    // burgerRecipeId
);
const completaArepaVariant: RecipeVariant = new RecipeVariant([pan, tomate, lechuga, queso, carne], [], new RecipeVariantSku("ARPCAR"));
const arepasDeCrhistian: Recipe = new Recipe(
    arepasDeCrhistianData,
    [simpleArepaVariant, completaArepaVariant],
    [masVendida, masRica],
    [tagParaFiltro1],
    new RecipeNutritionalData([]),
    [week1, week2],
    [Month.Abril, Month.Mayo, Month.Marzo, Month.Agosto],
    [plan2.id],
    []
    // arepasRecipeId
);

const mockDatabase: Recipe[] = [
    burgerHallouli,
    arepasDeCrhistian,
    arepasDeCrhistian,
    burgerHallouli,
    arepasDeCrhistian,
    arepasDeCrhistian,
    burgerHallouli,
    arepasDeCrhistian,
    arepasDeCrhistian,
];
export const mockRecipeRepository: IRecipeRepository = new MockRecipeRepository(mockDatabase);
