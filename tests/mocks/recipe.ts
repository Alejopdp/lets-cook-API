import { Recipe } from "../../src/bounded_contexts/operations/domain/recipe/Recipe";
import { RecipeCookDuration } from "../../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/RecipeCookDuration";
import { RecipeDescription } from "../../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/RecipeDescription";
import { RecipeDifficultyLevel } from "../../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { RecipeGeneralData } from "../../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/RecipeGeneralData";
import { RecipeSku } from "../../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/RecipeSku";
import { RecipeWeight } from "../../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/RecipeWeight";
import { WeightUnit } from "../../src/bounded_contexts/operations/domain/recipe/RecipeGeneralData/WeightUnit";
import { RecipeVariant } from "../../src/bounded_contexts/operations/domain/recipe/RecipeVariant/RecipeVariant";
import { RecipeVariantSku } from "../../src/bounded_contexts/operations/domain/recipe/RecipeVariant/RecipeVariantSku";
import { carne, cebolla, cerdo, lechuga, pan, queso, tomate, } from "./ingredients"
import { aptoTodo, aptoVegano, sinGluten } from "./retrictions";
import { masRica, masVendida } from "./recipeTags";
import { tagParaFiltro1, tagParaFiltro2 } from "./recipeBackofficeTags";
import { RecipeNutritionalData } from "../../src/bounded_contexts/operations/domain/recipe/RecipeNutritionalData/RecipeNutritionalData";
import { Month } from "../../src/bounded_contexts/operations/domain/recipe/Months";
import { gourmetPlan, planVegetariano } from "./plan";
import { RecipeId } from "../../src/bounded_contexts/operations/domain/recipe/RecipeId";


const burgerHallouliData: RecipeGeneralData = new RecipeGeneralData(
    "Burger de Hallouli",
    new RecipeDescription("Alta hamburguesa", "Alta hamburguesa papá la mejor de todas"),
    new RecipeCookDuration(45),
    RecipeDifficultyLevel.Facil,
    new RecipeWeight(250, WeightUnit.Gram),
    new RecipeSku("BRGH"),
    ["development/burger_hallouli.jpg"],
);

const carneBurgerVariant1: RecipeVariant = new RecipeVariant(
    [lechuga, tomate, cebolla, carne, pan, queso],
    aptoTodo,
    new RecipeVariantSku("BRGHCAR")
);
const cerdoVariant1: RecipeVariant = new RecipeVariant(
    [lechuga, tomate, cebolla, cerdo, pan, queso],
    aptoTodo,
    new RecipeVariantSku("BRGHCER")
);

export const burgerHallouli: Recipe = new Recipe(
    burgerHallouliData,
    [carneBurgerVariant1, cerdoVariant1],
    [masVendida],
    [tagParaFiltro1, tagParaFiltro2],
    new RecipeNutritionalData([]),
    [],
    [Month.Abril, Month.Mayo, Month.Marzo, Month.Agosto],
    [gourmetPlan.id],
    [],
    new Date(),
    new Date(),
    new RecipeId()
    // burgerRecipeId
);

const arepasDeCrhistianData: RecipeGeneralData = new RecipeGeneralData(
    "Arepas de Crhistian",
    new RecipeDescription("Las mejores arepas de Colombia", "Las mejores arepas hechas por el mejor dev de Colombia"),
    new RecipeCookDuration(50),
    RecipeDifficultyLevel.Dificil,
    new RecipeWeight(150, WeightUnit.Gram),
    new RecipeSku("ARP"),
    ["development/arepas.jpg"]
);
const simpleArepaVariant: RecipeVariant = new RecipeVariant(
    [pan],
    aptoVegano,
    new RecipeVariantSku("ARPVEG")
    // burgerRecipeId
);
const completaArepaVariant: RecipeVariant = new RecipeVariant(
    [pan, tomate, lechuga, queso, carne],
    sinGluten,
    new RecipeVariantSku("ARPCAR")
);
export const arepasDeCrhistian: Recipe = new Recipe(
    arepasDeCrhistianData,
    [simpleArepaVariant, completaArepaVariant],
    [masVendida, masRica],
    [tagParaFiltro1],
    new RecipeNutritionalData([]),
    [],
    [Month.Abril, Month.Mayo, Month.Marzo, Month.Agosto],
    [planVegetariano.id],
    [],
    new Date(),
    new Date(),
    new RecipeId()
);

export const rissotoDeBoniatoData: RecipeGeneralData = new RecipeGeneralData(
    "Rissoto de boniato",
    new RecipeDescription("Rissoto de boniato", "Rissoto de boniato"),
    new RecipeCookDuration(50),
    RecipeDifficultyLevel.Dificil,
    new RecipeWeight(150, WeightUnit.Gram),
    new RecipeSku("RIS"),
    ["development/rissoto.jpg"]
);

const rissotoDeBoniatoVariant1: RecipeVariant = new RecipeVariant(
    [pan, tomate, lechuga, queso, carne],
    sinGluten,
    new RecipeVariantSku("RISVEG")
);

export const rissotoDeBoniato: Recipe = new Recipe(
    rissotoDeBoniatoData,
    [rissotoDeBoniatoVariant1],
    [masVendida, masRica],
    [tagParaFiltro1],
    new RecipeNutritionalData([]),
    [],
    [Month.Abril, Month.Mayo, Month.Marzo, Month.Agosto],
    [planVegetariano.id],
    [],
    new Date(),
    new Date(),
    new RecipeId()
);


export const bowlDeQuinoaData: RecipeGeneralData = new RecipeGeneralData(
    "Bowl de quinoa",
    new RecipeDescription("Bowl de quinoa", "Bowl de quinoa"),
    new RecipeCookDuration(50),
    RecipeDifficultyLevel.Dificil,
    new RecipeWeight(150, WeightUnit.Gram),
    new RecipeSku("BQ"),
    ["development/bowl.jpg"]
);

const bowlDeQuinoaVariant1: RecipeVariant = new RecipeVariant(
    [pan, tomate, lechuga, queso, carne],
    aptoVegano,
    new RecipeVariantSku("BQVEG")
);

export const bowlDeQuinoa: Recipe = new Recipe(
    bowlDeQuinoaData,
    [bowlDeQuinoaVariant1],
    [masVendida, masRica],
    [tagParaFiltro1],
    new RecipeNutritionalData([]),
    [],
    [Month.Abril, Month.Mayo, Month.Marzo, Month.Agosto],
    [planVegetariano.id],
    [],
    new Date(),
    new Date(),
    new RecipeId()
);

