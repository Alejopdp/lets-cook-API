import { RecipeId } from "../src/bounded_contexts/operations/domain/recipe/RecipeId";
import { NutritionalItem } from "../src/bounded_contexts/operations/domain/recipe/RecipeNutritionalData/NutritionalItem";
import { RecipeVariantId } from "../src/bounded_contexts/operations/domain/recipe/RecipeVariant/RecipeVariantId";
import { mongooseIngredientRepository } from "../src/bounded_contexts/operations/infra/repositories/ingredient";
import { mongooseRecipeRepository } from "../src/bounded_contexts/operations/infra/repositories/recipe";
import { recipeGeneralDataMapper } from "../src/bounded_contexts/operations/mappers/recipeMapper";
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
    const weeks: Week[] = await mongooseWeekRepository.findNextTwelve(false);
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
        ["development/burger_hallouli.jpg"]
    );
    const carneBurgerVariant1: RecipeVariant = new RecipeVariant(
        [lechuga, tomate, cebolla, carne, pan, queso],
        restrictions[0],
        new RecipeVariantSku("BRGHCAR")
    );
    const cerdoVariant1: RecipeVariant = new RecipeVariant(
        [lechuga, tomate, cebolla, cerdo, pan, queso],
        restrictions[0],
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
        RecipeDifficultyLevel.Dificil,
        new RecipeWeight(150, WeightUnit.Gram),
        new RecipeSku("ARP"),
        ["development/arepas.jpg"]
    );
    const simpleArepaVariant: RecipeVariant = new RecipeVariant(
        [pan],
        restrictions[0],
        new RecipeVariantSku("ARPVEG")
        // burgerRecipeId
    );
    const completaArepaVariant: RecipeVariant = new RecipeVariant(
        [pan, tomate, lechuga, queso, carne],
        restrictions[0],
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

const baseProdRecipes = [
    {
        _id: "c2f60da7-6381-4d2d-a0a2-cbf3276e9cd4",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Sartén", "Recipiente de horno", "Olla pequeña"],
        availableMonths: [],
        availableWeeks: [
            "3578a6d0-caab-4911-a27c-aa361271e81e",
            "398333de-88a3-4b96-aec0-aa0266599e2d",
            "53dfff1b-7137-4a34-a8fa-899367533bfc",
            "72c251a1-9768-4792-abfa-b2f986884579",
        ],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "615737b7378de31483ca478e",
            },
            name: "Fusilli al forno",
            recipeDescription: {
                _id: {
                    $oid: "615737b7378de31483ca478f",
                },
                shortDescription: "este campo se debe eliminar, la Descri Larga debería ser el título largo",
                longDescription: "Fusilli al forno pasta horneada con soja al estilo italiano",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "615737b7378de31483ca4790",
                },
                timeValue: 35,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "615737b7378de31483ca4791",
                },
                weightValue: 1300,
                weightUnit: "gr",
            },
            sku: "R0090",
            imageUrl: "development/recipes/Fusilli_al_forno/Fusilli_al_forno.jpg",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Ajo",
                    "Albahaca fresca",
                    "Chalotas",
                    "Espinaca",
                    "Tomate troceado",
                    "Fusilli",
                    "Soja texturizada",
                    "Mozzarella",
                    "Ricotta",
                    "Pimentón picante",
                    "Azúcar moreno",
                    "Vinagre Balsámico",
                ],
                _id: {
                    $oid: "615737b7378de31483ca4792",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0090",
            },
            {
                ingredients: [
                    "Ajo",
                    "Albahaca fresca",
                    "Chalotas",
                    "Espinaca",
                    "Tomate troceado",
                    "Pasta sin gluten",
                    "Soja texturizada",
                    "Mozzarella",
                    "Ricotta",
                    "Pimentón picante",
                    "Azúcar moreno",
                    "Vinagre Balsámico",
                ],
                _id: {
                    $oid: "615737b7378de31483ca4793",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0090GL",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "615737b7378de31483ca4794",
                },
                key: "Valor energético",
                value: "158,9 Kcal",
            },
            {
                _id: {
                    $oid: "615737b7378de31483ca4795",
                },
                key: "Grasas",
                value: "4,4 g",
            },
            {
                _id: {
                    $oid: "615737b7378de31483ca4796",
                },
                key: "de las cuales saturadas",
                value: "2,5 g",
            },
            {
                _id: {
                    $oid: "615737b7378de31483ca4797",
                },
                key: "Hidratos de carbono",
                value: "17,6 g",
            },
            {
                _id: {
                    $oid: "615737b7378de31483ca4798",
                },
                key: "de los cuales azúcares",
                value: "2,9 g",
            },
            {
                _id: {
                    $oid: "615737b7378de31483ca4799",
                },
                key: "Proteínas",
                value: "11,8 g",
            },
            {
                _id: {
                    $oid: "615737b7378de31483ca479a",
                },
                key: "Sal",
                value: "0,2 g",
            },
        ],
        createdAt: {
            $date: "2021-08-19T22:05:30.991Z",
        },
        updatedAt: {
            $date: "2021-10-01T16:30:47.796Z",
        },
        __v: 0,
    },
    {
        _id: "1dd6676c-5104-4571-950e-b8b6e485b944",
        imageTags: ["Más elegida"],
        backOfficeTags: ["Más elegida"],
        tools: ["Tabla de cortar", "Cuchillo", "Olla", "Bol pequeño", "Bandeja de horno"],
        availableMonths: [],
        availableWeeks: [
            "3578a6d0-caab-4911-a27c-aa361271e81e",
            "398333de-88a3-4b96-aec0-aa0266599e2d",
            "53dfff1b-7137-4a34-a8fa-899367533bfc",
        ],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "615737bb378de31483ca479f",
            },
            name: "Salmón al wasabi",
            recipeDescription: {
                _id: {
                    $oid: "615737bb378de31483ca47a0",
                },
                shortDescription: "idem receta fusilli",
                longDescription: "Salmón al wasabi con tallarines y brócoli",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "615737bb378de31483ca47a1",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "615737bb378de31483ca47a2",
                },
                weightValue: 847,
                weightUnit: "gr",
            },
            sku: "R0146",
            imageUrl: "development/recipes/Salmón_al_wasabi/Salmón_al_wasabi",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Salmón",
                    "Brócoli",
                    "Sésamo tostado",
                    "Tallarín de arroz",
                    "Miel",
                    "Wasabi",
                    "Aceite de sésamo",
                    "Salsa de soja",
                    "Vinagre de arroz",
                ],
                _id: {
                    $oid: "615737bb378de31483ca47a3",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0146",
            },
            {
                ingredients: [
                    "Salmón",
                    "Brócoli",
                    "Sésamo tostado",
                    "Tallarín de arroz",
                    "Miel",
                    "Wasabi",
                    "Aceite de sésamo",
                    "Salsa de soja",
                    "Vinagre de arroz",
                ],
                _id: {
                    $oid: "615737bb378de31483ca47a4",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0146",
            },
            {
                ingredients: [
                    "Salmón",
                    "Brócoli",
                    "Sésamo tostado",
                    "Tallarín de arroz",
                    "Miel",
                    "Wasabi",
                    "Aceite de sésamo",
                    "Vinagre de arroz",
                    "Salsa de soja sin gluten",
                ],
                _id: {
                    $oid: "615737bb378de31483ca47a5",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0146GL",
            },
            {
                ingredients: [
                    "Salmón",
                    "Brócoli",
                    "Sésamo tostado",
                    "Tallarín de arroz",
                    "Miel",
                    "Wasabi",
                    "Aceite de sésamo",
                    "Vinagre de arroz",
                    "Salsa de soja sin gluten",
                ],
                _id: {
                    $oid: "615737bb378de31483ca47a6",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0146GL",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "615737bb378de31483ca47a7",
                },
                key: "Valor energético",
                value: "204,2 Kcal",
            },
            {
                _id: {
                    $oid: "615737bb378de31483ca47a8",
                },
                key: "Grasas",
                value: "6,8 g",
            },
            {
                _id: {
                    $oid: "615737bb378de31483ca47a9",
                },
                key: "de las cuales saturadas",
                value: "1,4 g",
            },
            {
                _id: {
                    $oid: "615737bb378de31483ca47aa",
                },
                key: "Hidratos de carbono",
                value: "21,7 g",
            },
            {
                _id: {
                    $oid: "615737bb378de31483ca47ab",
                },
                key: "de los cuales azúcares",
                value: "1,1 g",
            },
            {
                _id: {
                    $oid: "615737bb378de31483ca47ac",
                },
                key: "Proteínas",
                value: "11,2",
            },
            {
                _id: {
                    $oid: "615737bb378de31483ca47ad",
                },
                key: "Sal",
                value: "0,1 g",
            },
        ],
        createdAt: {
            $date: "2021-08-19T22:19:40.174Z",
        },
        updatedAt: {
            $date: "2021-10-01T16:30:51.053Z",
        },
        __v: 0,
    },
    {
        _id: "2022f456-cca1-4733-ae56-cb89e3a47036",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Olla pequeña", "Sartén", "Dos bols pequeños", "Dos bols grandes"],
        availableMonths: [],
        availableWeeks: [
            "3578a6d0-caab-4911-a27c-aa361271e81e",
            "398333de-88a3-4b96-aec0-aa0266599e2d",
            "53dfff1b-7137-4a34-a8fa-899367533bfc",
        ],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
            "60ff8bc4-899a-46cf-b40e-359cefa3518d",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "615739fd378de31483ca483c",
            },
            name: "Falafel con tabbouleh",
            recipeDescription: {
                _id: {
                    $oid: "615739fd378de31483ca483d",
                },
                shortDescription: "Falafel con tabbouleh y salsa de yogur con nueces",
                longDescription:
                    "Hay miles de maneras de hacer falafel pero, tradicionalmente, son tortitas fritas hechas de puré de\ngarbanzos (u otras legumbres), hierbas y condimentos. Puede servirse solo o en pita, sándwiches,\nensaladas o cualquier otro tipo de plato. Tiene su origen en el Medio Oriente aunque se ha convertido en uno de los alimentos callejeros más populares alrededor del mundo. Y ¡es delicioso!\nPlato rico en proteínas y fibra.",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "615739fd378de31483ca483e",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "615739fd378de31483ca483f",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0060",
            imageUrl: "development/recipes/Falafel_con_tabbouleh/Falafel_con_tabbouleh",
            difficultyLevel: "Media",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Ajo",
                    "Cebolla tierna",
                    "Pepino",
                    "Perejil",
                    "Tomate",
                    "Cilantro",
                    "Limón",
                    "Cuscús",
                    "Nueces",
                    "Harina de trigo",
                    "Garbanzos",
                    "Yogur griego",
                    "Levadura",
                    "Caldo vegetal",
                    "Comino molido",
                ],
                _id: {
                    $oid: "615739fd378de31483ca4840",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0060",
            },
            {
                ingredients: [
                    "Ajo",
                    "Cebolla tierna",
                    "Pepino",
                    "Perejil",
                    "Tomate",
                    "Cilantro",
                    "Limón",
                    "Quinoa",
                    "Nueces",
                    "Garbanzos",
                    "Harina sin gluten",
                    "Yogur griego",
                    "Levadura",
                    "Caldo vegetal",
                    "Comino molido",
                ],
                _id: {
                    $oid: "615739fd378de31483ca4841",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0060GL",
            },
            {
                ingredients: [
                    "Ajo",
                    "Cebolla tierna",
                    "Pepino",
                    "Perejil",
                    "Tomate",
                    "Cilantro",
                    "Limón",
                    "Quinoa",
                    "Nueces",
                    "Garbanzos",
                    "Harina sin gluten",
                    "Yogur de soja",
                    "Levadura",
                    "Caldo vegetal",
                    "Comino molido",
                ],
                _id: {
                    $oid: "615739fd378de31483ca4842",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0060LG",
            },
            {
                ingredients: [
                    "Ajo",
                    "Cebolla tierna",
                    "Pepino",
                    "Perejil",
                    "Tomate",
                    "Cilantro",
                    "Limón",
                    "Quinoa",
                    "Nueces",
                    "Garbanzos",
                    "Harina sin gluten",
                    "Yogur de soja",
                    "Levadura",
                    "Caldo vegetal",
                    "Comino molido",
                ],
                _id: {
                    $oid: "615739fd378de31483ca4843",
                },
                restriction: "13a03b53-c5e7-4e91-818d-93454ea7610c",
                sku: "R0060VG",
            },
            {
                ingredients: [
                    "Ajo",
                    "Cebolla tierna",
                    "Pepino",
                    "Perejil",
                    "Tomate",
                    "Cilantro",
                    "Limón",
                    "Cuscús",
                    "Nueces",
                    "Harina de trigo",
                    "Garbanzos",
                    "Yogur de soja",
                    "Levadura",
                    "Caldo vegetal",
                    "Comino molido",
                ],
                _id: {
                    $oid: "615739fd378de31483ca4844",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "R0060VE",
            },
            {
                ingredients: [
                    "Ajo",
                    "Cebolla tierna",
                    "Pepino",
                    "Perejil",
                    "Tomate",
                    "Cilantro",
                    "Limón",
                    "Cuscús",
                    "Nueces",
                    "Harina de trigo",
                    "Garbanzos",
                    "Yogur de soja",
                    "Levadura",
                    "Caldo vegetal",
                    "Comino molido",
                ],
                _id: {
                    $oid: "615739fd378de31483ca4845",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0060LA",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "615739fd378de31483ca4846",
                },
                key: "Valor energético",
                value: "92,5 Kcal",
            },
            {
                _id: {
                    $oid: "615739fd378de31483ca4847",
                },
                key: "Grasas",
                value: "2,0 g",
            },
            {
                _id: {
                    $oid: "615739fd378de31483ca4848",
                },
                key: "de las cuales saturadas",
                value: "0,8 g",
            },
            {
                _id: {
                    $oid: "615739fd378de31483ca4849",
                },
                key: "Hidratos de carbono",
                value: "14,6 g",
            },
            {
                _id: {
                    $oid: "615739fd378de31483ca484a",
                },
                key: "de los cuales azúcares",
                value: "1,6 g",
            },
            {
                _id: {
                    $oid: "615739fd378de31483ca484b",
                },
                key: "Proteínas",
                value: "3,2 g",
            },
            {
                _id: {
                    $oid: "615739fd378de31483ca484c",
                },
                key: "Sal",
                value: "0,5 g",
            },
        ],
        createdAt: {
            $date: "2021-08-20T23:29:17.701Z",
        },
        updatedAt: {
            $date: "2021-10-01T16:40:29.631Z",
        },
        __v: 0,
    },
    {
        _id: "35d83968-58de-4915-b43b-d16314bdfb5d",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Sartén", "Bandeja de horno", "Olla pequeña"],
        availableMonths: [],
        availableWeeks: [
            "3578a6d0-caab-4911-a27c-aa361271e81e",
            "398333de-88a3-4b96-aec0-aa0266599e2d",
            "53dfff1b-7137-4a34-a8fa-899367533bfc",
        ],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "615737c2378de31483ca47c7",
            },
            name: "Pimientos rellenos de ternera",
            recipeDescription: {
                _id: {
                    $oid: "615737c2378de31483ca47c8",
                },
                shortDescription: "eliminar",
                longDescription: "Pimientos rellenos de ternera con Ras El Hanout",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "615737c2378de31483ca47c9",
                },
                timeValue: 35,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "615737c2378de31483ca47ca",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0105",
            imageUrl: "development/recipes/Pimientos_rellenos_de_ternera/Pimientos_rellenos_de_ternera",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Carne de ternera picada",
                    "Ajo",
                    "Cebolla tierna",
                    "Pimiento rojo",
                    "Perejil",
                    "Quinoa",
                    "Yogur griego",
                    "Caldo vegetal",
                    "Ras el hanout",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "615737c2378de31483ca47cb",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0105",
            },
            {
                ingredients: [
                    "Carne de ternera picada",
                    "Ajo",
                    "Cebolla tierna",
                    "Pimiento rojo",
                    "Perejil",
                    "Quinoa",
                    "Yogur griego",
                    "Caldo vegetal",
                    "Ras el hanout",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "615737c2378de31483ca47cc",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0105",
            },
            {
                ingredients: [
                    "Carne de ternera picada",
                    "Ajo",
                    "Cebolla tierna",
                    "Pimiento rojo",
                    "Perejil",
                    "Quinoa",
                    "Yogur de soja",
                    "Caldo vegetal",
                    "Ras el hanout",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "615737c2378de31483ca47cd",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0105LA",
            },
            {
                ingredients: [
                    "Carne de ternera picada",
                    "Ajo",
                    "Cebolla tierna",
                    "Pimiento rojo",
                    "Perejil",
                    "Quinoa",
                    "Yogur de soja",
                    "Caldo vegetal",
                    "Ras el hanout",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "615737c2378de31483ca47ce",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0105LA",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "615737c2378de31483ca47cf",
                },
                key: "Valor energético",
                value: "80,0 Kcal",
            },
            {
                _id: {
                    $oid: "615737c2378de31483ca47d0",
                },
                key: "Grasas",
                value: "3,3 g",
            },
            {
                _id: {
                    $oid: "615737c2378de31483ca47d1",
                },
                key: "de las cuales saturadas",
                value: "1,4 g",
            },
            {
                _id: {
                    $oid: "615737c2378de31483ca47d2",
                },
                key: "Hidratos de carbono",
                value: "6,3 g",
            },
            {
                _id: {
                    $oid: "615737c2378de31483ca47d3",
                },
                key: "de los cuales azúcares",
                value: "1,7 g",
            },
            {
                _id: {
                    $oid: "615737c2378de31483ca47d4",
                },
                key: "Proteínas",
                value: "4,8 g",
            },
            {
                _id: {
                    $oid: "615737c2378de31483ca47d5",
                },
                key: "Sal",
                value: "0,6 g",
            },
        ],
        createdAt: {
            $date: "2021-08-21T19:08:10.490Z",
        },
        updatedAt: {
            $date: "2021-10-01T16:30:58.256Z",
        },
        __v: 0,
    },
    {
        _id: "20b507bc-af61-43a2-bf2f-aec358a3fa17",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Sartén", "Bol grande"],
        availableMonths: [],
        availableWeeks: ["72c251a1-9768-4792-abfa-b2f986884579", "aa13c9a8-2d50-430d-9bca-be95d3a9a33e"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "61260ea41ec7913662c8e60b",
            },
            name: "Secreto ibérico",
            recipeDescription: {
                _id: {
                    $oid: "61260ea41ec7913662c8e60c",
                },
                shortDescription: "eliminar",
                longDescription: "Secreto ibérico con ensalada tibia de patatas tiernas",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "61260ea41ec7913662c8e60d",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "61260ea41ec7913662c8e60e",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0036",
            imageUrl: "development/recipes/Secreto_ibérico/Secreto_ibérico",
            difficultyLevel: "Media",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Secreto ibérico",
                    "Cebolla tierna",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Patata mini",
                    "Limón",
                    "Alcaparras",
                    "Azúcar moreno",
                    "Sal pétalos",
                    "Mostaza Dijon",
                    "Miel",
                ],
                _id: {
                    $oid: "61260ea41ec7913662c8e60f",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0036",
            },
            {
                ingredients: [
                    "Secreto ibérico",
                    "Cebolla tierna",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Patata mini",
                    "Limón",
                    "Alcaparras",
                    "Azúcar moreno",
                    "Sal pétalos",
                    "Mostaza Dijon",
                    "Miel",
                ],
                _id: {
                    $oid: "61260ea41ec7913662c8e610",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0036",
            },
            {
                ingredients: [
                    "Secreto ibérico",
                    "Cebolla tierna",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Patata mini",
                    "Limón",
                    "Alcaparras",
                    "Azúcar moreno",
                    "Sal pétalos",
                    "Mostaza Dijon",
                    "Miel",
                ],
                _id: {
                    $oid: "61260ea41ec7913662c8e611",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0036",
            },
            {
                ingredients: [
                    "Secreto ibérico",
                    "Cebolla tierna",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Patata mini",
                    "Limón",
                    "Alcaparras",
                    "Azúcar moreno",
                    "Sal pétalos",
                    "Mostaza Dijon",
                    "Miel",
                ],
                _id: {
                    $oid: "61260ea41ec7913662c8e612",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0036",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "61260ea41ec7913662c8e613",
                },
                key: "Valor energético",
                value: "154,4 Kcal",
            },
            {
                _id: {
                    $oid: "61260ea41ec7913662c8e614",
                },
                key: "Grasas",
                value: "5,7 g",
            },
            {
                _id: {
                    $oid: "61260ea41ec7913662c8e615",
                },
                key: "de las cuales saturadas",
                value: "2,0 g",
            },
            {
                _id: {
                    $oid: "61260ea41ec7913662c8e616",
                },
                key: "Hidratos de carbono",
                value: "14,2 g",
            },
            {
                _id: {
                    $oid: "61260ea41ec7913662c8e617",
                },
                key: "de los cuales saturados",
                value: "1,5 g",
            },
            {
                _id: {
                    $oid: "61260ea41ec7913662c8e618",
                },
                key: "Proteínas",
                value: "10,25 g",
            },
            {
                _id: {
                    $oid: "61260ea41ec7913662c8e619",
                },
                key: "Sal",
                value: "0,1 g",
            },
        ],
        createdAt: {
            $date: "2021-08-21T19:13:40.964Z",
        },
        updatedAt: {
            $date: "2021-08-25T09:34:28.710Z",
        },
        __v: 0,
    },
    {
        _id: "473d2418-3b1b-49e1-a246-e00034f315b6",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Cuchillo", "Tabla de cortar", "Olla", "Recipiente de horno", "Bol pequeño"],
        availableMonths: [],
        availableWeeks: ["72c251a1-9768-4792-abfa-b2f986884579", "aa13c9a8-2d50-430d-9bca-be95d3a9a33e"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "6122a563b22c703815bdea1a",
            },
            name: "Pollo al estilo Tandoori",
            recipeDescription: {
                _id: {
                    $oid: "6122a563b22c703815bdea1b",
                },
                shortDescription: "eliminar",
                longDescription: "Pollo al estilo Tandoori con arroz basmati y ratia de menta",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "6122a563b22c703815bdea1c",
                },
                timeValue: 40,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "6122a563b22c703815bdea1d",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0117",
            imageUrl: "development/recipes/Pollo_al_estilo_Tandoori/Pollo_al_estilo_Tandoori",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Muslos de pollo",
                    "Ajo",
                    "Jengibre fresco",
                    "Menta",
                    "Limón",
                    "Arroz basmati",
                    "Yogur griego",
                    "Comino molido",
                    "Cilantro molido",
                    "Tandoor masala",
                ],
                _id: {
                    $oid: "6122a563b22c703815bdea1e",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0117",
            },
            {
                ingredients: [
                    "Muslos de pollo",
                    "Ajo",
                    "Jengibre fresco",
                    "Menta",
                    "Limón",
                    "Arroz basmati",
                    "Yogur griego",
                    "Comino molido",
                    "Cilantro molido",
                    "Tandoor masala",
                ],
                _id: {
                    $oid: "6122a563b22c703815bdea1f",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0117",
            },
            {
                ingredients: [
                    "Muslos de pollo",
                    "Ajo",
                    "Jengibre fresco",
                    "Menta",
                    "Limón",
                    "Arroz basmati",
                    "Yogur de soja",
                    "Comino molido",
                    "Cilantro molido",
                    "Tandoor masala",
                ],
                _id: {
                    $oid: "6122a563b22c703815bdea20",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0117LA",
            },
            {
                ingredients: [
                    "Muslos de pollo",
                    "Ajo",
                    "Jengibre fresco",
                    "Menta",
                    "Limón",
                    "Arroz basmati",
                    "Yogur de soja",
                    "Comino molido",
                    "Cilantro molido",
                    "Tandoor masala",
                ],
                _id: {
                    $oid: "6122a563b22c703815bdea21",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0117LA",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "6122a563b22c703815bdea22",
                },
                key: "Valor energético",
                value: "179,9 Kcal",
            },
            {
                _id: {
                    $oid: "6122a563b22c703815bdea23",
                },
                key: "Grasas",
                value: "9,5 g",
            },
            {
                _id: {
                    $oid: "6122a563b22c703815bdea24",
                },
                key: "de las cuales saturadas",
                value: "3,2 g",
            },
            {
                _id: {
                    $oid: "6122a563b22c703815bdea25",
                },
                key: "Hidratos de carbono",
                value: "5,7 g",
            },
            {
                _id: {
                    $oid: "6122a563b22c703815bdea26",
                },
                key: "de los cuales azúcares",
                value: "1,1 g",
            },
            {
                _id: {
                    $oid: "6122a563b22c703815bdea27",
                },
                key: "Proteínas",
                value: "16,5 g",
            },
            {
                _id: {
                    $oid: "6122a563b22c703815bdea28",
                },
                key: "Sal",
                value: "0 g",
            },
        ],
        createdAt: {
            $date: "2021-08-21T19:18:56.896Z",
        },
        updatedAt: {
            $date: "2021-08-22T19:28:35.095Z",
        },
        __v: 0,
    },
    {
        _id: "8def5442-12e2-48bb-bae2-34ce2b93a7e9",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Cuchillo", "Tabla de cortar", "Bandeja de horno", "Olla", "Bol"],
        availableMonths: [],
        availableWeeks: ["aa13c9a8-2d50-430d-9bca-be95d3a9a33e"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "60ff8bc4-899a-46cf-b40e-359cefa3518d",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "612619201ec7913662c8e85f",
            },
            name: "Halloumi en sésamo al horno",
            recipeDescription: {
                _id: {
                    $oid: "612619201ec7913662c8e860",
                },
                shortDescription: "eliminar",
                longDescription: "Halloumi en sésamo al horno con ensalada de bulgur",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612619201ec7913662c8e861",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612619201ec7913662c8e862",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0192",
            imageUrl: "development/recipes/Halloumi_en_sésamo_al_horno/Halloumi_en_sésamo_al_horno",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Perejil",
                    "Tomates cherry",
                    "Cebolla roja",
                    "Cebolleta japonesa",
                    "Menta",
                    "Limón",
                    "Bulgur",
                    "Sésamo tostado",
                    "Queso Halloumi",
                    "Miel",
                ],
                _id: {
                    $oid: "612619201ec7913662c8e863",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0192",
            },
            {
                ingredients: [
                    "Perejil",
                    "Tomates cherry",
                    "Cebolla roja",
                    "Cebolleta japonesa",
                    "Menta",
                    "Limón",
                    "Quinoa",
                    "Sésamo tostado",
                    "Queso Halloumi",
                    "Miel",
                ],
                _id: {
                    $oid: "612619201ec7913662c8e864",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0192GL",
            },
            {
                ingredients: [
                    "Perejil",
                    "Tomates cherry",
                    "Cebolla roja",
                    "Cebolleta japonesa",
                    "Menta",
                    "Limón",
                    "Quinoa",
                    "Sésamo tostado",
                    "Queso Halloumi vegano",
                    "Miel",
                ],
                _id: {
                    $oid: "612619201ec7913662c8e865",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0192LG",
            },
            {
                ingredients: [
                    "Perejil",
                    "Tomates cherry",
                    "Cebolla roja",
                    "Cebolleta japonesa",
                    "Menta",
                    "Limón",
                    "Quinoa",
                    "Sésamo tostado",
                    "Queso Halloumi vegano",
                    "Sirope de arce",
                ],
                _id: {
                    $oid: "612619201ec7913662c8e866",
                },
                restriction: "13a03b53-c5e7-4e91-818d-93454ea7610c",
                sku: "R0192VG",
            },
            {
                ingredients: [
                    "Perejil",
                    "Tomates cherry",
                    "Cebolla roja",
                    "Cebolleta japonesa",
                    "Menta",
                    "Limón",
                    "Bulgur",
                    "Sésamo tostado",
                    "Queso Halloumi vegano",
                    "Sirope de arce",
                ],
                _id: {
                    $oid: "612619201ec7913662c8e867",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "R0192VE",
            },
            {
                ingredients: [
                    "Perejil",
                    "Tomates cherry",
                    "Cebolla roja",
                    "Cebolleta japonesa",
                    "Menta",
                    "Limón",
                    "Bulgur",
                    "Sésamo tostado",
                    "Queso Halloumi vegano",
                    "Miel",
                ],
                _id: {
                    $oid: "612619201ec7913662c8e868",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0192LA",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "612619201ec7913662c8e869",
                },
                key: "Valor energético",
                value: "161,6 Kcal",
            },
            {
                _id: {
                    $oid: "612619201ec7913662c8e86a",
                },
                key: "Grasas",
                value: "6,1 g",
            },
            {
                _id: {
                    $oid: "612619201ec7913662c8e86b",
                },
                key: "de las cuales saturadas",
                value: "3,6 g",
            },
            {
                _id: {
                    $oid: "612619201ec7913662c8e86c",
                },
                key: "Hidratos de carbono",
                value: "18,6 g",
            },
            {
                _id: {
                    $oid: "612619201ec7913662c8e86d",
                },
                key: "de los cuales azúcares",
                value: "2,6 g",
            },
            {
                _id: {
                    $oid: "612619201ec7913662c8e86e",
                },
                key: "Proteínas",
                value: "7,9 g",
            },
            {
                _id: {
                    $oid: "612619201ec7913662c8e86f",
                },
                key: "Sal",
                value: "0,7 g",
            },
        ],
        createdAt: {
            $date: "2021-08-21T19:26:45.151Z",
        },
        updatedAt: {
            $date: "2021-08-25T10:19:12.407Z",
        },
        __v: 0,
    },
    {
        _id: "dedd5576-7f6c-48bc-9baf-346817e778fe",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Sartén", "Bandeja de horno"],
        availableMonths: [],
        availableWeeks: ["72c251a1-9768-4792-abfa-b2f986884579", "aa13c9a8-2d50-430d-9bca-be95d3a9a33e"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "60ff8bc4-899a-46cf-b40e-359cefa3518d",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "6122245fb22c703815bde950",
            },
            name: "Boniato al horno",
            recipeDescription: {
                _id: {
                    $oid: "6122245fb22c703815bde951",
                },
                shortDescription: "eliminar",
                longDescription: "Boniato al horno con salteado y salsa agridulce",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "6122245fb22c703815bde952",
                },
                timeValue: 40,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "6122245fb22c703815bde953",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0194",
            imageUrl: "development/recipes/Boniato_al_horno/Boniato_al_horno",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Boniato",
                    "Brócoli",
                    "Champiñones Portobello",
                    "Pimiento rojo",
                    "Zanahoria",
                    "Cilantro",
                    "Cebollino",
                    "Cebolla roja",
                    "Lima",
                    "Salsa sweet chili",
                ],
                _id: {
                    $oid: "6122245fb22c703815bde954",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0194",
            },
            {
                ingredients: [
                    "Boniato",
                    "Brócoli",
                    "Champiñones Portobello",
                    "Pimiento rojo",
                    "Zanahoria",
                    "Cilantro",
                    "Cebollino",
                    "Cebolla roja",
                    "Lima",
                    "Salsa sweet chili",
                ],
                _id: {
                    $oid: "6122245fb22c703815bde955",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0194",
            },
            {
                ingredients: [
                    "Boniato",
                    "Brócoli",
                    "Champiñones Portobello",
                    "Pimiento rojo",
                    "Zanahoria",
                    "Cilantro",
                    "Cebollino",
                    "Cebolla roja",
                    "Lima",
                    "Salsa sweet chili",
                ],
                _id: {
                    $oid: "6122245fb22c703815bde956",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0194",
            },
            {
                ingredients: [
                    "Boniato",
                    "Brócoli",
                    "Champiñones Portobello",
                    "Pimiento rojo",
                    "Zanahoria",
                    "Cilantro",
                    "Cebollino",
                    "Cebolla roja",
                    "Lima",
                    "Salsa sweet chili",
                ],
                _id: {
                    $oid: "6122245fb22c703815bde957",
                },
                restriction: "13a03b53-c5e7-4e91-818d-93454ea7610c",
                sku: "R0194",
            },
            {
                ingredients: [
                    "Boniato",
                    "Brócoli",
                    "Champiñones Portobello",
                    "Pimiento rojo",
                    "Zanahoria",
                    "Cilantro",
                    "Cebollino",
                    "Cebolla roja",
                    "Lima",
                    "Salsa sweet chili",
                ],
                _id: {
                    $oid: "6122245fb22c703815bde958",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0194",
            },
            {
                ingredients: [
                    "Boniato",
                    "Brócoli",
                    "Champiñones Portobello",
                    "Pimiento rojo",
                    "Zanahoria",
                    "Cilantro",
                    "Cebollino",
                    "Cebolla roja",
                    "Lima",
                    "Salsa sweet chili",
                ],
                _id: {
                    $oid: "6122245fb22c703815bde959",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "R0194",
            },
        ],
        nutritionalInfo: [],
        createdAt: {
            $date: "2021-08-22T10:17:39.356Z",
        },
        updatedAt: {
            $date: "2021-08-22T10:18:07.805Z",
        },
        __v: 0,
    },
    {
        _id: "90026d6a-231c-4a95-ac6b-2e47bd4b1d56",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Cuchillo", "Tabla de cortar", "Olla", "Sartén", "Recipiente de horno", "Bol"],
        availableMonths: [],
        availableWeeks: ["aa13c9a8-2d50-430d-9bca-be95d3a9a33e"],
        relatedPlans: [
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
            "10ff7d25-527b-4775-a23c-26133aefa84e",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "6126193d1ec7913662c8e874",
            },
            name: "Pollo al estilo provenzal",
            recipeDescription: {
                _id: {
                    $oid: "6126193d1ec7913662c8e875",
                },
                shortDescription: "eliminar",
                longDescription: "Pollo al estilo provenzal en salsa de vino blanco",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "6126193d1ec7913662c8e876",
                },
                timeValue: 40,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "6126193d1ec7913662c8e877",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0118",
            imageUrl: "development/recipes/Pollo_al_estilo_provenzal/Pollo_al_estilo_provenzal",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Chalotas",
                    "Tomate",
                    "Aceitunas verdes",
                    "Arroz Largo",
                    "Mix Pollo Provenzal",
                    "Caldo de pollo",
                    "Vino blanco",
                ],
                _id: {
                    $oid: "6126193d1ec7913662c8e878",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0118",
            },
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Chalotas",
                    "Tomate",
                    "Aceitunas verdes",
                    "Arroz Largo",
                    "Caldo vegetal",
                    "Mix Pollo Provenzal",
                    "Vino blanco",
                ],
                _id: {
                    $oid: "6126193d1ec7913662c8e879",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0118GL",
            },
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Chalotas",
                    "Tomate",
                    "Aceitunas verdes",
                    "Arroz Largo",
                    "Caldo vegetal",
                    "Mix Pollo Provenzal",
                    "Vino blanco",
                ],
                _id: {
                    $oid: "6126193d1ec7913662c8e87a",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0118GL",
            },
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Chalotas",
                    "Tomate",
                    "Aceitunas verdes",
                    "Arroz Largo",
                    "Mix Pollo Provenzal",
                    "Caldo de pollo",
                    "Vino blanco",
                ],
                _id: {
                    $oid: "6126193d1ec7913662c8e87b",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0118",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "6126193d1ec7913662c8e87c",
                },
                key: "Valor energético",
                value: "85,6 Kcal",
            },
            {
                _id: {
                    $oid: "6126193d1ec7913662c8e87d",
                },
                key: "Grasas",
                value: "4,3 g",
            },
            {
                _id: {
                    $oid: "6126193d1ec7913662c8e87e",
                },
                key: "de las cuales saturadas",
                value: "1,5 g",
            },
            {
                _id: {
                    $oid: "6126193d1ec7913662c8e87f",
                },
                key: "Hidratos de carbono",
                value: "3,9 g",
            },
            {
                _id: {
                    $oid: "6126193d1ec7913662c8e880",
                },
                key: "de los cuales azúcares",
                value: "0,6 g",
            },
            {
                _id: {
                    $oid: "6126193d1ec7913662c8e881",
                },
                key: "Proteínas",
                value: "7,2 g",
            },
            {
                _id: {
                    $oid: "6126193d1ec7913662c8e882",
                },
                key: "Sal",
                value: "0 g",
            },
        ],
        createdAt: {
            $date: "2021-08-22T19:34:41.809Z",
        },
        updatedAt: {
            $date: "2021-08-25T10:19:41.839Z",
        },
        __v: 0,
    },
    {
        _id: "ac722c36-f692-47f5-a6fc-f0b3a79f7d8e",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Cuchillo", "Tabla de cortar", "Sartén", "Olla", "Rallador"],
        availableMonths: [],
        availableWeeks: [],
        relatedPlans: [
            "60ff8bc4-899a-46cf-b40e-359cefa3518d",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
            "10ff7d25-527b-4775-a23c-26133aefa84e",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "6125202a1ec7913662c8e094",
            },
            name: "Gnocchi con verduras",
            recipeDescription: {
                _id: {
                    $oid: "6125202a1ec7913662c8e095",
                },
                shortDescription: "eliminar",
                longDescription: "Gnocchi con verduras en salsa de queso Manchego",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "6125202a1ec7913662c8e096",
                },
                timeValue: 20,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "6125202a1ec7913662c8e097",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0123",
            imageUrl: "development/recipes/Gnocchi_con_verduras/Gnocchi_con_verduras",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: ["Ajo", "Calabacín", "Tomates cherry", "Pimiento amarillo", "Gnocchi", "Mantequilla", "Queso manchego"],
                _id: {
                    $oid: "6125202a1ec7913662c8e098",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0123",
            },
            {
                ingredients: [
                    "Ajo",
                    "Calabacín",
                    "Tomates cherry",
                    "Pimiento amarillo",
                    "Gnocchi sin gluten ni lactosa",
                    "Mantequilla",
                    "Queso manchego",
                ],
                _id: {
                    $oid: "6125202a1ec7913662c8e099",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0123GL",
            },
            {
                ingredients: [
                    "Ajo",
                    "Calabacín",
                    "Tomates cherry",
                    "Pimiento amarillo",
                    "Gnocchi sin gluten ni lactosa",
                    "Mozzarella vegana",
                ],
                _id: {
                    $oid: "6125202a1ec7913662c8e09a",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0123LG",
            },
            {
                ingredients: [
                    "Ajo",
                    "Calabacín",
                    "Tomates cherry",
                    "Pimiento amarillo",
                    "Gnocchi sin gluten ni lactosa",
                    "Mozzarella vegana",
                ],
                _id: {
                    $oid: "6125202a1ec7913662c8e09b",
                },
                restriction: "13a03b53-c5e7-4e91-818d-93454ea7610c",
                sku: "R0123VG",
            },
            {
                ingredients: [
                    "Ajo",
                    "Calabacín",
                    "Tomates cherry",
                    "Pimiento amarillo",
                    "Gnocchi sin gluten ni lactosa",
                    "Mozzarella vegana",
                ],
                _id: {
                    $oid: "6125202a1ec7913662c8e09c",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "R0123VE",
            },
            {
                ingredients: [
                    "Ajo",
                    "Calabacín",
                    "Tomates cherry",
                    "Pimiento amarillo",
                    "Gnocchi sin gluten ni lactosa",
                    "Mozzarella vegana",
                ],
                _id: {
                    $oid: "6125202a1ec7913662c8e09d",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0123LA",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "6125202a1ec7913662c8e09e",
                },
                key: "Valor energético",
                value: "138,0 Kcal",
            },
            {
                _id: {
                    $oid: "6125202a1ec7913662c8e09f",
                },
                key: "Grasas",
                value: "4,3 g",
            },
            {
                _id: {
                    $oid: "6125202a1ec7913662c8e0a0",
                },
                key: "de las cuales saturadas",
                value: "2,5 g",
            },
            {
                _id: {
                    $oid: "6125202a1ec7913662c8e0a1",
                },
                key: "Hidratos de carbono",
                value: "19,7 g",
            },
            {
                _id: {
                    $oid: "6125202a1ec7913662c8e0a2",
                },
                key: "de los cuales azúcares",
                value: "0,5 g",
            },
            {
                _id: {
                    $oid: "6125202a1ec7913662c8e0a3",
                },
                key: "Proteínas",
                value: "5,0 g",
            },
            {
                _id: {
                    $oid: "6125202a1ec7913662c8e0a4",
                },
                key: "Sal",
                value: "0,3 g",
            },
        ],
        createdAt: {
            $date: "2021-08-22T21:21:29.734Z",
        },
        updatedAt: {
            $date: "2021-08-24T16:36:58.614Z",
        },
        __v: 0,
    },
    {
        _id: "ace4f73a-f5c4-4d39-9fb2-57563e238ab0",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Olla pequeña", "Olla grande", "Bol"],
        availableMonths: [],
        availableWeeks: ["72c251a1-9768-4792-abfa-b2f986884579", "aa13c9a8-2d50-430d-9bca-be95d3a9a33e"],
        relatedPlans: [
            "60ff8bc4-899a-46cf-b40e-359cefa3518d",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "10ff7d25-527b-4775-a23c-26133aefa84e",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "6122c11eb22c703815bdebd5",
            },
            name: "Guiso de lentejas con quinoa",
            recipeDescription: {
                _id: {
                    $oid: "6122c11eb22c703815bdebd6",
                },
                shortDescription: "eliminar",
                longDescription: "Guiso de lentejas con quinoa y boniato",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "6122c11eb22c703815bdebd7",
                },
                timeValue: 40,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "6122c11eb22c703815bdebd8",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0151",
            imageUrl: "development/recipes/Guiso_de_lentejas_con_quinoa/Guiso_de_lentejas_con_quinoa",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Boniato",
                    "Perejil",
                    "Puerro",
                    "Tomates cherry",
                    "Zanahoria",
                    "Cebolla roja",
                    "Quinoa",
                    "Lentejas pardina",
                    "Pimentón dulce",
                    "Vino blanco",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "6122c11eb22c703815bdebd9",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0151",
            },
            {
                ingredients: [
                    "Boniato",
                    "Perejil",
                    "Puerro",
                    "Tomates cherry",
                    "Zanahoria",
                    "Cebolla roja",
                    "Quinoa",
                    "Lentejas pardina",
                    "Pimentón dulce",
                    "Vino blanco",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "6122c11eb22c703815bdebda",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0151",
            },
            {
                ingredients: [
                    "Boniato",
                    "Perejil",
                    "Puerro",
                    "Tomates cherry",
                    "Zanahoria",
                    "Cebolla roja",
                    "Quinoa",
                    "Lentejas pardina",
                    "Pimentón dulce",
                    "Vino blanco",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "6122c11eb22c703815bdebdb",
                },
                restriction: "13a03b53-c5e7-4e91-818d-93454ea7610c",
                sku: "R0151",
            },
            {
                ingredients: [
                    "Boniato",
                    "Perejil",
                    "Puerro",
                    "Tomates cherry",
                    "Zanahoria",
                    "Cebolla roja",
                    "Quinoa",
                    "Lentejas pardina",
                    "Pimentón dulce",
                    "Vino blanco",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "6122c11eb22c703815bdebdc",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0151",
            },
            {
                ingredients: [
                    "Boniato",
                    "Perejil",
                    "Puerro",
                    "Tomates cherry",
                    "Zanahoria",
                    "Cebolla roja",
                    "Quinoa",
                    "Lentejas pardina",
                    "Pimentón dulce",
                    "Vino blanco",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "6122c11eb22c703815bdebdd",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0151",
            },
            {
                ingredients: [
                    "Boniato",
                    "Perejil",
                    "Puerro",
                    "Tomates cherry",
                    "Zanahoria",
                    "Cebolla roja",
                    "Quinoa",
                    "Lentejas pardina",
                    "Pimentón dulce",
                    "Vino blanco",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "6122c11eb22c703815bdebde",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "R0151",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "6122c11eb22c703815bdebdf",
                },
                key: "Valor energético",
                value: "72,7 Kcal",
            },
            {
                _id: {
                    $oid: "6122c11eb22c703815bdebe0",
                },
                key: "Grasas",
                value: "1,2 g",
            },
            {
                _id: {
                    $oid: "6122c11eb22c703815bdebe1",
                },
                key: "de las cuales saturadas",
                value: "0,4 g",
            },
            {
                _id: {
                    $oid: "6122c11eb22c703815bdebe2",
                },
                key: "Hidratos de carbono",
                value: "13,3 g",
            },
            {
                _id: {
                    $oid: "6122c11eb22c703815bdebe3",
                },
                key: "de los cuales azúcares",
                value: "3,8 g",
            },
            {
                _id: {
                    $oid: "6122c11eb22c703815bdebe4",
                },
                key: "Proteínas",
                value: "2,1 g",
            },
            {
                _id: {
                    $oid: "6122c11eb22c703815bdebe5",
                },
                key: "Sal",
                value: "0,2 g",
            },
        ],
        createdAt: {
            $date: "2021-08-22T21:26:54.477Z",
        },
        updatedAt: {
            $date: "2021-08-22T21:26:54.477Z",
        },
        __v: 0,
    },
    {
        _id: "87354c16-8be1-45e1-8451-2b5a503fb750",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Olla pequeña", "Sartén u olla grande con tapa"],
        availableMonths: [],
        availableWeeks: ["01531d68-3712-4a2e-8891-f03a6092eed5", "72c251a1-9768-4792-abfa-b2f986884579"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "612e707597e12f48c36ea386",
            },
            name: "Pollo Tikka Masala",
            recipeDescription: {
                _id: {
                    $oid: "612e707597e12f48c36ea387",
                },
                shortDescription: "eliminar",
                longDescription: "Pollo tikka masala con arroz basmati",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612e707597e12f48c36ea388",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612e707597e12f48c36ea389",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0033",
            imageUrl: "development/recipes/Pollo_Tikka_Masala/Pollo_Tikka_Masala",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Cebolla tierna",
                    "Cilantro",
                    "Jengibre fresco",
                    "Guindilla verde",
                    "Arroz basmati",
                    "Yogur griego",
                    "Ghee",
                    "Azúcar moreno",
                    "Garam masala",
                    "Cúrcuma",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "612e707597e12f48c36ea38a",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0033",
            },
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Cebolla tierna",
                    "Cilantro",
                    "Jengibre fresco",
                    "Guindilla verde",
                    "Arroz basmati",
                    "Yogur griego",
                    "Ghee",
                    "Azúcar moreno",
                    "Garam masala",
                    "Cúrcuma",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "612e707597e12f48c36ea38b",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0033",
            },
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Cebolla tierna",
                    "Cilantro",
                    "Jengibre fresco",
                    "Guindilla verde",
                    "Arroz basmati",
                    "Yogur de soja",
                    "Azúcar moreno",
                    "Garam masala",
                    "Cúrcuma",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "612e707597e12f48c36ea38c",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0033LA",
            },
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Cebolla tierna",
                    "Cilantro",
                    "Jengibre fresco",
                    "Guindilla verde",
                    "Arroz basmati",
                    "Yogur de soja",
                    "Azúcar moreno",
                    "Garam masala",
                    "Cúrcuma",
                    "Tomate triturado",
                ],
                _id: {
                    $oid: "612e707597e12f48c36ea38d",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0033LA",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "612e707597e12f48c36ea38e",
                },
                key: "Valor energético",
                value: "179,2 Kcal",
            },
            {
                _id: {
                    $oid: "612e707597e12f48c36ea38f",
                },
                key: "Grasas",
                value: "8,3 g",
            },
            {
                _id: {
                    $oid: "612e707597e12f48c36ea390",
                },
                key: "de las cuales saturadas",
                value: "3,0 g",
            },
            {
                _id: {
                    $oid: "612e707597e12f48c36ea391",
                },
                key: "Hidratos de carbono",
                value: "13,2 g",
            },
            {
                _id: {
                    $oid: "612e707597e12f48c36ea392",
                },
                key: "de los cuales azúcares",
                value: "1,4 g",
            },
            {
                _id: {
                    $oid: "612e707597e12f48c36ea393",
                },
                key: "Proteínas",
                value: "12,1 g",
            },
            {
                _id: {
                    $oid: "612e707597e12f48c36ea394",
                },
                key: "Sal",
                value: "0,1 g",
            },
        ],
        createdAt: {
            $date: "2021-08-24T16:09:39.957Z",
        },
        updatedAt: {
            $date: "2021-08-31T18:09:57.530Z",
        },
        __v: 0,
    },
    {
        _id: "723f5556-73f7-44b1-8f93-ab8d29b4f972",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Cuchillo", "Tabla de cortar", "Bandeja de horno", "Bol", "Sartén"],
        availableMonths: [],
        availableWeeks: ["01531d68-3712-4a2e-8891-f03a6092eed5", "72c251a1-9768-4792-abfa-b2f986884579"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "612e705897e12f48c36ea35e",
            },
            name: "Hamburguesa de salmón",
            recipeDescription: {
                _id: {
                    $oid: "612e705897e12f48c36ea35f",
                },
                shortDescription: "eliminar",
                longDescription: "Hamburguesa de salmón en brioche con boniato asado",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612e705897e12f48c36ea360",
                },
                timeValue: 35,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612e705897e12f48c36ea361",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0189",
            imageUrl: "development/recipes/Hamburguesa_de_salmón/Hamburguesa_de_salmón",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Salmón",
                    "Aguacate",
                    "Boniato",
                    "Lechuga",
                    "Tomate",
                    "Eneldo fresco",
                    "Cebolla roja",
                    "Limón",
                    "Pan de brioche",
                    "Mayonesa",
                ],
                _id: {
                    $oid: "612e705897e12f48c36ea362",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0189",
            },
            {
                ingredients: [
                    "Salmón",
                    "Aguacate",
                    "Boniato",
                    "Lechuga",
                    "Tomate",
                    "Eneldo fresco",
                    "Cebolla roja",
                    "Limón",
                    "Pan Burguer sin gluten",
                    "Mayonesa",
                ],
                _id: {
                    $oid: "612e705897e12f48c36ea363",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0189GL",
            },
            {
                ingredients: [
                    "Salmón",
                    "Aguacate",
                    "Boniato",
                    "Lechuga",
                    "Tomate",
                    "Eneldo fresco",
                    "Cebolla roja",
                    "Limón",
                    "Pan Burguer sin gluten",
                    "Mayonesa",
                ],
                _id: {
                    $oid: "612e705897e12f48c36ea364",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0189GL",
            },
            {
                ingredients: [
                    "Salmón",
                    "Aguacate",
                    "Boniato",
                    "Lechuga",
                    "Tomate",
                    "Eneldo fresco",
                    "Cebolla roja",
                    "Limón",
                    "Pan de hamburguesa",
                    "Mayonesa",
                ],
                _id: {
                    $oid: "612e705897e12f48c36ea365",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0189LA",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "612e705897e12f48c36ea366",
                },
                key: "Valor energético",
                value: "124,8 Kcal",
            },
            {
                _id: {
                    $oid: "612e705897e12f48c36ea367",
                },
                key: "Grasas",
                value: "6,6 g",
            },
            {
                _id: {
                    $oid: "612e705897e12f48c36ea368",
                },
                key: "de las cuales saturadas",
                value: "1,2 g",
            },
            {
                _id: {
                    $oid: "612e705897e12f48c36ea369",
                },
                key: "Hidratos de carbono",
                value: "11,9 g",
            },
            {
                _id: {
                    $oid: "612e705897e12f48c36ea36a",
                },
                key: "de los cuales azúcares",
                value: "3,1 g",
            },
            {
                _id: {
                    $oid: "612e705897e12f48c36ea36b",
                },
                key: "Proteínas",
                value: "5,4 g",
            },
            {
                _id: {
                    $oid: "612e705897e12f48c36ea36c",
                },
                key: "Sal",
                value: "0 g",
            },
        ],
        createdAt: {
            $date: "2021-08-24T16:21:33.502Z",
        },
        updatedAt: {
            $date: "2021-08-31T18:09:28.959Z",
        },
        __v: 0,
    },
    {
        _id: "aa6a309e-35e3-47e6-869f-3059096ec9a4",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Cuchillo", "Tabla de cortar"],
        availableMonths: [],
        availableWeeks: ["72c251a1-9768-4792-abfa-b2f986884579"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "61260e4f1ec7913662c8e549",
            },
            name: "Onglet coliflor y chimichurri",
            recipeDescription: {
                _id: {
                    $oid: "61260e4f1ec7913662c8e54a",
                },
                shortDescription: "eliminar",
                longDescription: "esta receta está en construcción",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "61260e4f1ec7913662c8e54b",
                },
                timeValue: 1,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "61260e4f1ec7913662c8e54c",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0217",
            imageUrl: "development/recipes/Tapa_coliflor_y_chimichurri/Tapa_coliflor_y_chimichurri",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: ["Onglet de ternera", "Ajo", "Chalotas", "Coliflor", "Perejil", "Orégano", "Vinagre"],
                _id: {
                    $oid: "61260e4f1ec7913662c8e54d",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0217",
            },
            {
                ingredients: ["Onglet de ternera", "Ajo", "Chalotas", "Coliflor", "Perejil", "Orégano", "Vinagre"],
                _id: {
                    $oid: "61260e4f1ec7913662c8e54e",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0217",
            },
            {
                ingredients: ["Onglet de ternera", "Ajo", "Chalotas", "Coliflor", "Perejil", "Orégano", "Vinagre"],
                _id: {
                    $oid: "61260e4f1ec7913662c8e54f",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0217",
            },
            {
                ingredients: ["Onglet de ternera", "Ajo", "Chalotas", "Coliflor", "Perejil", "Orégano", "Vinagre"],
                _id: {
                    $oid: "61260e4f1ec7913662c8e550",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0217",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "61260e4f1ec7913662c8e551",
                },
                key: "Valor energético",
                value: "104,7 Kcal",
            },
            {
                _id: {
                    $oid: "61260e4f1ec7913662c8e552",
                },
                key: "Grasas",
                value: "2,2 g",
            },
            {
                _id: {
                    $oid: "61260e4f1ec7913662c8e553",
                },
                key: "de las cuales saturadas",
                value: "0,8 g",
            },
            {
                _id: {
                    $oid: "61260e4f1ec7913662c8e554",
                },
                key: "Hidratos de carbono",
                value: "5,7 g",
            },
            {
                _id: {
                    $oid: "61260e4f1ec7913662c8e555",
                },
                key: "de los cuales azúcares",
                value: "1,3 g",
            },
            {
                _id: {
                    $oid: "61260e4f1ec7913662c8e556",
                },
                key: "Proteínas",
                value: "7,1 g",
            },
            {
                _id: {
                    $oid: "61260e4f1ec7913662c8e557",
                },
                key: "Sal",
                value: "0,12 g",
            },
        ],
        createdAt: {
            $date: "2021-08-24T16:48:10.563Z",
        },
        updatedAt: {
            $date: "2021-08-25T09:33:03.766Z",
        },
        __v: 0,
    },
    {
        _id: "77a2b0e3-d314-4f1b-904c-564ec90bdc4e",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Olla pequeña", "Pelador", "Sartén x2", "Bandeja de horno"],
        availableMonths: [],
        availableWeeks: ["01531d68-3712-4a2e-8891-f03a6092eed5", "72c251a1-9768-4792-abfa-b2f986884579"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
            "60ff8bc4-899a-46cf-b40e-359cefa3518d",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "612e706897e12f48c36ea371",
            },
            name: "Risotto de chalotas caramelizadas",
            recipeDescription: {
                _id: {
                    $oid: "612e706897e12f48c36ea372",
                },
                shortDescription: "eliminar",
                longDescription: "Risotto de chalotas caramelizadas con láminas de calabacín",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612e706897e12f48c36ea373",
                },
                timeValue: 40,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612e706897e12f48c36ea374",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0031",
            imageUrl: "development/recipes/Risotto_de_chalotas_caramelizadas/Risotto_de_chalotas_caramelizadas",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Ajo",
                    "Calabacín",
                    "Chalotas",
                    "Limón",
                    "Arroz arborio",
                    "Queso Parmesano rallado",
                    "Caldo vegetal",
                    "Vinagre Balsámico",
                ],
                _id: {
                    $oid: "612e706897e12f48c36ea375",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0031",
            },
            {
                ingredients: [
                    "Ajo",
                    "Calabacín",
                    "Chalotas",
                    "Limón",
                    "Arroz arborio",
                    "Queso Parmesano rallado",
                    "Caldo vegetal",
                    "Vinagre Balsámico",
                ],
                _id: {
                    $oid: "612e706897e12f48c36ea376",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0031",
            },
            {
                ingredients: [
                    "Ajo",
                    "Calabacín",
                    "Chalotas",
                    "Limón",
                    "Arroz arborio",
                    "Parmesano rallado vegano",
                    "Caldo vegetal",
                    "Vinagre Balsámico",
                ],
                _id: {
                    $oid: "612e706897e12f48c36ea377",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0031LA",
            },
            {
                ingredients: [
                    "Ajo",
                    "Calabacín",
                    "Chalotas",
                    "Limón",
                    "Arroz arborio",
                    "Parmesano rallado vegano",
                    "Caldo vegetal",
                    "Vinagre Balsámico",
                ],
                _id: {
                    $oid: "612e706897e12f48c36ea378",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0031LA",
            },
            {
                ingredients: [
                    "Ajo",
                    "Calabacín",
                    "Chalotas",
                    "Limón",
                    "Arroz arborio",
                    "Parmesano rallado vegano",
                    "Caldo vegetal",
                    "Vinagre Balsámico",
                ],
                _id: {
                    $oid: "612e706897e12f48c36ea379",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "R0031VE",
            },
            {
                ingredients: [
                    "Ajo",
                    "Calabacín",
                    "Chalotas",
                    "Limón",
                    "Arroz arborio",
                    "Parmesano rallado vegano",
                    "Caldo vegetal",
                    "Vinagre Balsámico",
                ],
                _id: {
                    $oid: "612e706897e12f48c36ea37a",
                },
                restriction: "13a03b53-c5e7-4e91-818d-93454ea7610c",
                sku: "R0031VE",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "612e706897e12f48c36ea37b",
                },
                key: "Valor energético",
                value: "92,5 Kcal",
            },
            {
                _id: {
                    $oid: "612e706897e12f48c36ea37c",
                },
                key: "Grasas",
                value: "2,4 g",
            },
            {
                _id: {
                    $oid: "612e706897e12f48c36ea37d",
                },
                key: "de las cuales saturadas",
                value: "1,4 g",
            },
            {
                _id: {
                    $oid: "612e706897e12f48c36ea37e",
                },
                key: "Hidratos de carbono",
                value: "12,7 g",
            },
            {
                _id: {
                    $oid: "612e706897e12f48c36ea37f",
                },
                key: "de los cuales azúcares",
                value: "1,2 g",
            },
            {
                _id: {
                    $oid: "612e706897e12f48c36ea380",
                },
                key: "Proteínas",
                value: "3,8 g",
            },
            {
                _id: {
                    $oid: "612e706897e12f48c36ea381",
                },
                key: "Sal",
                value: "1,1 g",
            },
        ],
        createdAt: {
            $date: "2021-08-24T17:11:00.499Z",
        },
        updatedAt: {
            $date: "2021-08-31T18:09:44.458Z",
        },
        __v: 0,
    },
    {
        _id: "da2c41ba-5c4d-467d-ab68-2f6750ec7097",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Olla pequeña", "Bandeja de horno x2"],
        availableMonths: [],
        availableWeeks: ["72c251a1-9768-4792-abfa-b2f986884579"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "60ff8bc4-899a-46cf-b40e-359cefa3518d",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: true,
        recipeGeneralData: {
            _id: {
                $oid: "612613db1ec7913662c8e61a",
            },
            name: "Bulgur con garbanzos tostados",
            recipeDescription: {
                _id: {
                    $oid: "612613db1ec7913662c8e61b",
                },
                shortDescription: "eliminar",
                longDescription: "Bulgur con garbanzos tostados y verduras al horno",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612613db1ec7913662c8e61c",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612613db1ec7913662c8e61d",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0032",
            imageUrl: "development/recipes/Bulgur_con_garbanzos_tostados/Bulgur_con_garbanzos_tostados",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Calabacín",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Cebolleta japonesa",
                    "Limón",
                    "Bulgur",
                    "Garbanzos",
                    "Queso feta",
                    "Pimentón dulce",
                    "Caldo vegetal",
                ],
                _id: {
                    $oid: "612613db1ec7913662c8e61e",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0032",
            },
            {
                ingredients: [
                    "Calabacín",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Cebolleta japonesa",
                    "Limón",
                    "Quinoa",
                    "Garbanzos",
                    "Queso feta",
                    "Pimentón dulce",
                    "Caldo vegetal",
                ],
                _id: {
                    $oid: "612613db1ec7913662c8e61f",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0032GL",
            },
            {
                ingredients: [
                    "Calabacín",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Cebolleta japonesa",
                    "Limón",
                    "Quinoa",
                    "Garbanzos",
                    "Queso feta vegano",
                    "Pimentón dulce",
                    "Caldo vegetal",
                ],
                _id: {
                    $oid: "612613db1ec7913662c8e620",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0032LG",
            },
            {
                ingredients: [
                    "Calabacín",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Cebolleta japonesa",
                    "Limón",
                    "Quinoa",
                    "Garbanzos",
                    "Queso feta vegano",
                    "Pimentón dulce",
                    "Caldo vegetal",
                ],
                _id: {
                    $oid: "612613db1ec7913662c8e621",
                },
                restriction: "13a03b53-c5e7-4e91-818d-93454ea7610c",
                sku: "R0032VG",
            },
            {
                ingredients: [
                    "Calabacín",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Cebolleta japonesa",
                    "Limón",
                    "Bulgur",
                    "Garbanzos",
                    "Queso feta vegano",
                    "Pimentón dulce",
                    "Caldo vegetal",
                ],
                _id: {
                    $oid: "612613db1ec7913662c8e622",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0032LA",
            },
            {
                ingredients: [
                    "Calabacín",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Cebolleta japonesa",
                    "Limón",
                    "Bulgur",
                    "Garbanzos",
                    "Queso feta vegano",
                    "Pimentón dulce",
                    "Caldo vegetal",
                ],
                _id: {
                    $oid: "612613db1ec7913662c8e623",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "R0032VE",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "612613db1ec7913662c8e624",
                },
                key: "Valor enerégetico",
                value: "114,8 Kcal",
            },
            {
                _id: {
                    $oid: "612613db1ec7913662c8e625",
                },
                key: "Grasas",
                value: "2,2 g",
            },
            {
                _id: {
                    $oid: "612613db1ec7913662c8e626",
                },
                key: "de las cuales saturadas",
                value: "1,1 g",
            },
            {
                _id: {
                    $oid: "612613db1ec7913662c8e627",
                },
                key: "Hidratos de carbono",
                value: "18,0 g",
            },
            {
                _id: {
                    $oid: "612613db1ec7913662c8e628",
                },
                key: "de los cuales azúcares",
                value: "1,8 g",
            },
            {
                _id: {
                    $oid: "612613db1ec7913662c8e629",
                },
                key: "Proteínas",
                value: "4,4 g",
            },
            {
                _id: {
                    $oid: "612613db1ec7913662c8e62a",
                },
                key: "Sal",
                value: "0,8 g",
            },
        ],
        createdAt: {
            $date: "2021-08-25T09:56:43.940Z",
        },
        updatedAt: {
            $date: "2021-08-25T11:04:03.132Z",
        },
        __v: 0,
    },
    {
        _id: "b17c4d9a-1dbf-42aa-b361-efe68de0af45",
        imageTags: ["Vegetariana"],
        backOfficeTags: ["Vegetariana"],
        tools: ["Tabla de cortar", "Cuchillo", "Olla pequeña", "Bandeja de horno x2"],
        availableMonths: [],
        availableWeeks: ["01531d68-3712-4a2e-8891-f03a6092eed5", "72c251a1-9768-4792-abfa-b2f986884579"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "60ff8bc4-899a-46cf-b40e-359cefa3518d",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "612e707f97e12f48c36ea399",
            },
            name: "Bulgur con garbanzos tostados",
            recipeDescription: {
                _id: {
                    $oid: "612e707f97e12f48c36ea39a",
                },
                shortDescription: "eliminar",
                longDescription: "Bulgur con garbanzos tostados y verduras al horno",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612e707f97e12f48c36ea39b",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612e707f97e12f48c36ea39c",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0032",
            imageUrl: "development/recipes/Bulgur_con_garbanzos_tostados/Bulgur_con_garbanzos_tostados",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Calabacín",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Cebolleta japonesa",
                    "Limón",
                    "Bulgur",
                    "Garbanzos",
                    "Queso feta",
                    "Pimentón dulce",
                    "Caldo vegetal",
                ],
                _id: {
                    $oid: "612e707f97e12f48c36ea39d",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0032",
            },
            {
                ingredients: [
                    "Calabacín",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Cebolleta japonesa",
                    "Limón",
                    "Quinoa",
                    "Garbanzos",
                    "Queso feta",
                    "Pimentón dulce",
                    "Caldo vegetal",
                ],
                _id: {
                    $oid: "612e707f97e12f48c36ea39e",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0032GL",
            },
            {
                ingredients: [
                    "Calabacín",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Cebolleta japonesa",
                    "Limón",
                    "Quinoa",
                    "Garbanzos",
                    "Queso feta vegano",
                    "Pimentón dulce",
                    "Caldo vegetal",
                ],
                _id: {
                    $oid: "612e707f97e12f48c36ea39f",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0032LG",
            },
            {
                ingredients: [
                    "Calabacín",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Cebolleta japonesa",
                    "Limón",
                    "Quinoa",
                    "Garbanzos",
                    "Queso feta vegano",
                    "Pimentón dulce",
                    "Caldo vegetal",
                ],
                _id: {
                    $oid: "612e707f97e12f48c36ea3a0",
                },
                restriction: "13a03b53-c5e7-4e91-818d-93454ea7610c",
                sku: "R0032VG",
            },
            {
                ingredients: [
                    "Calabacín",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Cebolleta japonesa",
                    "Limón",
                    "Bulgur",
                    "Garbanzos",
                    "Queso feta vegano",
                    "Pimentón dulce",
                    "Caldo vegetal",
                ],
                _id: {
                    $oid: "612e707f97e12f48c36ea3a1",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0032LA",
            },
            {
                ingredients: [
                    "Calabacín",
                    "Tomates cherry",
                    "Tomillo fresco",
                    "Cebolleta japonesa",
                    "Limón",
                    "Bulgur",
                    "Garbanzos",
                    "Queso feta vegano",
                    "Pimentón dulce",
                    "Caldo vegetal",
                ],
                _id: {
                    $oid: "612e707f97e12f48c36ea3a2",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "R0032VE",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "612e707f97e12f48c36ea3a3",
                },
                key: "Valor enerégetico",
                value: "114,8 Kcal",
            },
            {
                _id: {
                    $oid: "612e707f97e12f48c36ea3a4",
                },
                key: "Grasas",
                value: "2,2 g",
            },
            {
                _id: {
                    $oid: "612e707f97e12f48c36ea3a5",
                },
                key: "de las cuales saturadas",
                value: "1,1 g",
            },
            {
                _id: {
                    $oid: "612e707f97e12f48c36ea3a6",
                },
                key: "Hidratos de carbono",
                value: "18,0 g",
            },
            {
                _id: {
                    $oid: "612e707f97e12f48c36ea3a7",
                },
                key: "de los cuales azúcares",
                value: "1,8 g",
            },
            {
                _id: {
                    $oid: "612e707f97e12f48c36ea3a8",
                },
                key: "Proteínas",
                value: "4,4 g",
            },
            {
                _id: {
                    $oid: "612e707f97e12f48c36ea3a9",
                },
                key: "Sal",
                value: "0,8 g",
            },
        ],
        createdAt: {
            $date: "2021-08-25T09:56:50.342Z",
        },
        updatedAt: {
            $date: "2021-08-31T18:10:07.014Z",
        },
        __v: 0,
    },
    {
        _id: "e53129ac-9879-416a-b51b-97fd611cd102",
        imageTags: ["Vegana"],
        backOfficeTags: ["Vegana"],
        tools: ["Tabla de cortar", "Cuchillo", "Olla", "Sartén"],
        availableMonths: [],
        availableWeeks: [
            "01531d68-3712-4a2e-8891-f03a6092eed5",
            "4ec40f9a-edbc-4c5d-8552-549cbd32c195",
            "72c251a1-9768-4792-abfa-b2f986884579",
        ],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "60ff8bc4-899a-46cf-b40e-359cefa3518d",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "6137bfa4a1c6ea0dd849d397",
            },
            name: "Pozole vegano de frijoles",
            recipeDescription: {
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d398",
                },
                shortDescription: "eliminar",
                longDescription: "Pozole vegano de frijoles con tortilla tostada y aguacate",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d399",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d39a",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0200",
            imageUrl: "development/recipes/Pozole_vegano_de_frijoles/Pozole_vegano_de_frijoles",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Aguacate",
                    "Ajo",
                    "Cebolla tierna",
                    "Cilantro",
                    "Guindilla verde",
                    "Lima",
                    "Tortilla de trigo",
                    "Maíz dulce",
                    "Alubia roja",
                    "Orégano",
                    "Caldo vegetal",
                    "Comino molido",
                    "Pasta de tomate",
                ],
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d39b",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0200",
            },
            {
                ingredients: [
                    "Aguacate",
                    "Ajo",
                    "Cebolla tierna",
                    "Cilantro",
                    "Guindilla verde",
                    "Lima",
                    "Tortilla de trigo",
                    "Maíz dulce",
                    "Alubia roja",
                    "Orégano",
                    "Caldo vegetal",
                    "Comino molido",
                    "Pasta de tomate",
                ],
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d39c",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "R0200",
            },
            {
                ingredients: [
                    "Aguacate",
                    "Ajo",
                    "Cebolla tierna",
                    "Cilantro",
                    "Guindilla verde",
                    "Lima",
                    "Tortilla de trigo",
                    "Maíz dulce",
                    "Alubia roja",
                    "Orégano",
                    "Caldo vegetal",
                    "Comino molido",
                    "Pasta de tomate",
                ],
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d39d",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0200",
            },
            {
                ingredients: [
                    "Aguacate",
                    "Ajo",
                    "Cebolla tierna",
                    "Cilantro",
                    "Guindilla verde",
                    "Lima",
                    "Maíz dulce",
                    "Alubia roja",
                    "Tortilla de maíz",
                    "Orégano",
                    "Caldo vegetal",
                    "Comino molido",
                    "Pasta de tomate",
                ],
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d39e",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0200GL",
            },
            {
                ingredients: [
                    "Aguacate",
                    "Ajo",
                    "Cebolla tierna",
                    "Cilantro",
                    "Guindilla verde",
                    "Lima",
                    "Maíz dulce",
                    "Alubia roja",
                    "Tortilla de maíz",
                    "Orégano",
                    "Caldo vegetal",
                    "Comino molido",
                    "Pasta de tomate",
                ],
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d39f",
                },
                restriction: "13a03b53-c5e7-4e91-818d-93454ea7610c",
                sku: "R0200GL",
            },
            {
                ingredients: [
                    "Aguacate",
                    "Ajo",
                    "Cebolla tierna",
                    "Cilantro",
                    "Guindilla verde",
                    "Lima",
                    "Maíz dulce",
                    "Alubia roja",
                    "Tortilla de maíz",
                    "Orégano",
                    "Caldo vegetal",
                    "Comino molido",
                    "Pasta de tomate",
                ],
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d3a0",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0200GL",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d3a1",
                },
                key: "Valor energético",
                value: "117,6 Kcal",
            },
            {
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d3a2",
                },
                key: "Grasas",
                value: "3,8 g",
            },
            {
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d3a3",
                },
                key: "de las cuales saturadas",
                value: "1,0 g",
            },
            {
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d3a4",
                },
                key: "Hidratos de carbono",
                value: "17,0 g",
            },
            {
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d3a5",
                },
                key: "de los cuales azúcares",
                value: "2,2 g",
            },
            {
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d3a6",
                },
                key: "Proteínas",
                value: "4,0 g",
            },
            {
                _id: {
                    $oid: "6137bfa4a1c6ea0dd849d3a7",
                },
                key: "Sal",
                value: "1,0 g",
            },
        ],
        createdAt: {
            $date: "2021-08-25T10:12:30.333Z",
        },
        updatedAt: {
            $date: "2021-09-07T19:38:12.677Z",
        },
        __v: 0,
    },
    {
        _id: "5b22b881-f9b1-4d8f-9dc1-bf924998174c",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Sartén", "Rallador", "Bol grande o ensaladera"],
        availableMonths: [],
        availableWeeks: ["72c251a1-9768-4792-abfa-b2f986884579"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "61261b421ec7913662c8e883",
            },
            name: "Ensalada de kale con pollo",
            recipeDescription: {
                _id: {
                    $oid: "61261b421ec7913662c8e884",
                },
                shortDescription: "eliminar",
                longDescription: "Ensalada de kale y hoja de roble con pollo al limón",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "61261b421ec7913662c8e885",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "61261b421ec7913662c8e886",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0078",
            imageUrl: "development/recipes/Ensalada_de_kale_con_pollo/Ensalada_de_kale_con_pollo",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Ajo",
                    "Kale",
                    "Hoja de roble",
                    "Limón",
                    "Picatostes",
                    "Yogur griego",
                    "Queso Parmesano",
                    "Azúcar moreno",
                ],
                _id: {
                    $oid: "61261b421ec7913662c8e887",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0078",
            },
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Ajo",
                    "Kale",
                    "Hoja de roble",
                    "Limón",
                    "Picatostes sin gluten",
                    "Yogur griego",
                    "Queso Parmesano",
                    "Azúcar moreno",
                ],
                _id: {
                    $oid: "61261b421ec7913662c8e888",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0078GL",
            },
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Ajo",
                    "Kale",
                    "Hoja de roble",
                    "Limón",
                    "Picatostes sin gluten",
                    "Parmesano vegano",
                    "Yogur de soja",
                    "Azúcar moreno",
                ],
                _id: {
                    $oid: "61261b421ec7913662c8e889",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0078LG",
            },
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Ajo",
                    "Kale",
                    "Hoja de roble",
                    "Limón",
                    "Picatostes",
                    "Parmesano vegano",
                    "Yogur de soja",
                    "Azúcar moreno",
                ],
                _id: {
                    $oid: "61261b421ec7913662c8e88a",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0078LA",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "61261b421ec7913662c8e88b",
                },
                key: "Valor energético",
                value: "190,9 Kcal",
            },
            {
                _id: {
                    $oid: "61261b421ec7913662c8e88c",
                },
                key: "Grasas",
                value: "10,3 g",
            },
            {
                _id: {
                    $oid: "61261b421ec7913662c8e88d",
                },
                key: "de las cuales saturadas",
                value: "3,9 g",
            },
            {
                _id: {
                    $oid: "61261b421ec7913662c8e88e",
                },
                key: "Hidratos de carbono",
                value: "8,2 g",
            },
            {
                _id: {
                    $oid: "61261b421ec7913662c8e88f",
                },
                key: "de los cuales azúcares",
                value: "2,6 g",
            },
            {
                _id: {
                    $oid: "61261b421ec7913662c8e890",
                },
                key: "Proteínas",
                value: "15,8 g",
            },
            {
                _id: {
                    $oid: "61261b421ec7913662c8e891",
                },
                key: "Sal",
                value: "0,2 g",
            },
        ],
        createdAt: {
            $date: "2021-08-25T10:28:18.924Z",
        },
        updatedAt: {
            $date: "2021-08-25T10:28:18.924Z",
        },
        __v: 0,
    },
    {
        _id: "bc696cfe-6235-45ff-a85d-bdb6448df6e8",
        imageTags: ["Vegetariana"],
        backOfficeTags: ["Vegetariana"],
        tools: ["Tabla de cortar", "Cuchillo", "Olla", "Bol", "Bandeja de horno"],
        availableMonths: [],
        availableWeeks: ["01531d68-3712-4a2e-8891-f03a6092eed5", "72c251a1-9768-4792-abfa-b2f986884579"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
            "60ff8bc4-899a-46cf-b40e-359cefa3518d",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "612e708797e12f48c36ea3ae",
            },
            name: "Berenjena teriyaki",
            recipeDescription: {
                _id: {
                    $oid: "612e708797e12f48c36ea3af",
                },
                shortDescription: "eliminar",
                longDescription: "Berenjena teriyaki con higos y parmesano",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612e708797e12f48c36ea3b0",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612e708797e12f48c36ea3b1",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0128",
            imageUrl: "development/recipes/Berenjena_teriyaki/Berenjena_teriyaki",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: ["Berenjena", "Rúcula", "Tomates cherry", "Cilantro", "Higo", "Quinoa", "Queso Parmesano", "Salsa Teriyaki"],
                _id: {
                    $oid: "612e708797e12f48c36ea3b2",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0128",
            },
            {
                ingredients: [
                    "Berenjena",
                    "Rúcula",
                    "Tomates cherry",
                    "Cilantro",
                    "Higo",
                    "Quinoa",
                    "Queso Parmesano",
                    "Salsa Teriyaki sin gluten",
                ],
                _id: {
                    $oid: "612e708797e12f48c36ea3b3",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0128GL",
            },
            {
                ingredients: [
                    "Berenjena",
                    "Rúcula",
                    "Tomates cherry",
                    "Cilantro",
                    "Higo",
                    "Quinoa",
                    "Parmesano vegano",
                    "Salsa Teriyaki sin gluten",
                ],
                _id: {
                    $oid: "612e708797e12f48c36ea3b4",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0128LG",
            },
            {
                ingredients: [
                    "Berenjena",
                    "Rúcula",
                    "Tomates cherry",
                    "Cilantro",
                    "Higo",
                    "Quinoa",
                    "Parmesano vegano",
                    "Salsa Teriyaki sin gluten",
                ],
                _id: {
                    $oid: "612e708797e12f48c36ea3b5",
                },
                restriction: "13a03b53-c5e7-4e91-818d-93454ea7610c",
                sku: "R0128VG",
            },
            {
                ingredients: ["Berenjena", "Rúcula", "Tomates cherry", "Cilantro", "Higo", "Quinoa", "Parmesano vegano", "Salsa Teriyaki"],
                _id: {
                    $oid: "612e708797e12f48c36ea3b6",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "R0128VE",
            },
            {
                ingredients: ["Berenjena", "Rúcula", "Tomates cherry", "Cilantro", "Higo", "Quinoa", "Parmesano vegano", "Salsa Teriyaki"],
                _id: {
                    $oid: "612e708797e12f48c36ea3b7",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0128LA",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "612e708797e12f48c36ea3b8",
                },
                key: "Valor energético",
                value: "65,6 Kcal",
            },
            {
                _id: {
                    $oid: "612e708797e12f48c36ea3b9",
                },
                key: "Grasas",
                value: "1,4 g",
            },
            {
                _id: {
                    $oid: "612e708797e12f48c36ea3ba",
                },
                key: "de las cuales saturadas",
                value: "0,5 g",
            },
            {
                _id: {
                    $oid: "612e708797e12f48c36ea3bb",
                },
                key: "Hidratos de carbono",
                value: "9,1 g",
            },
            {
                _id: {
                    $oid: "612e708797e12f48c36ea3bc",
                },
                key: "de los cuales azúcares",
                value: "4,1 g",
            },
            {
                _id: {
                    $oid: "612e708797e12f48c36ea3bd",
                },
                key: "Proteínas",
                value: "3,5 g",
            },
            {
                _id: {
                    $oid: "612e708797e12f48c36ea3be",
                },
                key: "Sal",
                value: "0,2 g",
            },
        ],
        createdAt: {
            $date: "2021-08-25T10:54:31.270Z",
        },
        updatedAt: {
            $date: "2021-08-31T18:10:15.124Z",
        },
        __v: 0,
    },
    {
        _id: "24eab0ed-0b06-45b3-97c4-3be4d0994f0a",
        imageTags: ["Vegana"],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Olla", "Wok o Sartén", "Bol pequeño"],
        availableMonths: [],
        availableWeeks: ["72c251a1-9768-4792-abfa-b2f986884579"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "60ff8bc4-899a-46cf-b40e-359cefa3518d",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "612622fa1ec7913662c8eb7c",
            },
            name: "Bowl de tofu al sésamo",
            recipeDescription: {
                _id: {
                    $oid: "612622fa1ec7913662c8eb7d",
                },
                shortDescription: "eliminar",
                longDescription: "Bowl de tofu al sésamo con fideos y tahini",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612622fa1ec7913662c8eb7e",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612622fa1ec7913662c8eb7f",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0107",
            imageUrl: "development/recipes/Bowl_de_tofu_al_sésamo/Bowl_de_tofu_al_sésamo",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Ajo",
                    "Pimiento rojo",
                    "Jengibre fresco",
                    "Cebolla roja",
                    "Lima",
                    "Sésamo tostado",
                    "Tallarines yakisoba",
                    "Tahini",
                    "Sriracha",
                    "Salsa de soja",
                    "Tofu",
                ],
                _id: {
                    $oid: "612622fa1ec7913662c8eb80",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0107",
            },
            {
                ingredients: [
                    "Ajo",
                    "Pimiento rojo",
                    "Jengibre fresco",
                    "Cebolla roja",
                    "Lima",
                    "Sésamo tostado",
                    "Tallarines yakisoba",
                    "Tahini",
                    "Sriracha",
                    "Salsa de soja",
                    "Tofu",
                ],
                _id: {
                    $oid: "612622fa1ec7913662c8eb81",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "R0107",
            },
            {
                ingredients: [
                    "Ajo",
                    "Pimiento rojo",
                    "Jengibre fresco",
                    "Cebolla roja",
                    "Lima",
                    "Sésamo tostado",
                    "Tallarines yakisoba",
                    "Tahini",
                    "Sriracha",
                    "Salsa de soja",
                    "Tofu",
                ],
                _id: {
                    $oid: "612622fa1ec7913662c8eb82",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0107",
            },
            {
                ingredients: [
                    "Ajo",
                    "Pimiento rojo",
                    "Jengibre fresco",
                    "Cebolla roja",
                    "Lima",
                    "Sésamo tostado",
                    "Tallarín de arroz",
                    "Tahini",
                    "Sriracha",
                    "Salsa de soja sin gluten",
                    "Tofu",
                ],
                _id: {
                    $oid: "612622fa1ec7913662c8eb83",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0107GL",
            },
            {
                ingredients: [
                    "Ajo",
                    "Pimiento rojo",
                    "Jengibre fresco",
                    "Cebolla roja",
                    "Lima",
                    "Sésamo tostado",
                    "Tallarín de arroz",
                    "Tahini",
                    "Sriracha",
                    "Salsa de soja sin gluten",
                    "Tofu",
                ],
                _id: {
                    $oid: "612622fa1ec7913662c8eb84",
                },
                restriction: "13a03b53-c5e7-4e91-818d-93454ea7610c",
                sku: "R0107GL",
            },
            {
                ingredients: [
                    "Ajo",
                    "Pimiento rojo",
                    "Jengibre fresco",
                    "Cebolla roja",
                    "Lima",
                    "Sésamo tostado",
                    "Tallarín de arroz",
                    "Tahini",
                    "Sriracha",
                    "Salsa de soja sin gluten",
                    "Tofu",
                ],
                _id: {
                    $oid: "612622fa1ec7913662c8eb85",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0107GL",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "612622fa1ec7913662c8eb86",
                },
                key: "Valor energético",
                value: "109,6 Kcal",
            },
            {
                _id: {
                    $oid: "612622fa1ec7913662c8eb87",
                },
                key: "Grasas",
                value: "3,3 g",
            },
            {
                _id: {
                    $oid: "612622fa1ec7913662c8eb88",
                },
                key: "de las cuales saturadas",
                value: "0,5 g",
            },
            {
                _id: {
                    $oid: "612622fa1ec7913662c8eb89",
                },
                key: "Hidratos de carbono",
                value: "16,2 g",
            },
            {
                _id: {
                    $oid: "612622fa1ec7913662c8eb8a",
                },
                key: "de los cuales azúcares",
                value: "1,2 g",
            },
            {
                _id: {
                    $oid: "612622fa1ec7913662c8eb8b",
                },
                key: "Proteínas",
                value: "5,6 g",
            },
            {
                _id: {
                    $oid: "612622fa1ec7913662c8eb8c",
                },
                key: "Sal",
                value: "0,3 g",
            },
        ],
        createdAt: {
            $date: "2021-08-25T11:01:14.106Z",
        },
        updatedAt: {
            $date: "2021-08-25T11:01:14.106Z",
        },
        __v: 0,
    },
    {
        _id: "a58aba6d-2621-48a9-bf79-f44c8ee4ffa2",
        imageTags: ["Vegana"],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Batidora"],
        availableMonths: [],
        availableWeeks: [
            "01531d68-3712-4a2e-8891-f03a6092eed5",
            "3578a6d0-caab-4911-a27c-aa361271e81e",
            "398333de-88a3-4b96-aec0-aa0266599e2d",
            "4ec40f9a-edbc-4c5d-8552-549cbd32c195",
            "5213f2b9-9465-4fc1-b717-ecd7590fcf45",
            "53dfff1b-7137-4a34-a8fa-899367533bfc",
            "654218bb-22f0-443b-9780-d70c81452d74",
            "6d681979-c37c-4139-8e9a-f01b12a5335f",
            "72c251a1-9768-4792-abfa-b2f986884579",
            "81a73c19-bf18-42b5-8e19-1f21d6fbd5b1",
            "aa13c9a8-2d50-430d-9bca-be95d3a9a33e",
            "c71c9f4c-56e1-4348-9fb9-c178ed12a2e7",
        ],
        relatedPlans: ["18a45ef6-0f6f-4187-842a-62232292961d"],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "612649aba1cb1e52b6af9bc2",
            },
            name: "Açai bowl",
            recipeDescription: {
                _id: {
                    $oid: "612649aba1cb1e52b6af9bc3",
                },
                shortDescription: "eliminar",
                longDescription: "Açai bowl con frutos rojos",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612649aba1cb1e52b6af9bc4",
                },
                timeValue: 15,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612649aba1cb1e52b6af9bc5",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "AD001",
            imageUrl: "development/recipes/Açai_bowl/Açai_bowl",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: ["Frutos rojos", "Plátano", "Copos de avena", "Nueces", "Almendras", "Canela", "Acai", "Bebida de avena"],
                _id: {
                    $oid: "612649aba1cb1e52b6af9bc6",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "AD001",
            },
            {
                ingredients: ["Frutos rojos", "Plátano", "Copos de avena", "Nueces", "Almendras", "Canela", "Acai", "Bebida de avena"],
                _id: {
                    $oid: "612649aba1cb1e52b6af9bc7",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "AD001",
            },
            {
                ingredients: ["Frutos rojos", "Plátano", "Copos de avena", "Nueces", "Almendras", "Canela", "Acai", "Bebida de avena"],
                _id: {
                    $oid: "612649aba1cb1e52b6af9bc8",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "AD001",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "612649aba1cb1e52b6af9bc9",
                },
                key: "Valor energético",
                value: "98,4 Kcal",
            },
            {
                _id: {
                    $oid: "612649aba1cb1e52b6af9bca",
                },
                key: "Grasas",
                value: "3,6 g",
            },
            {
                _id: {
                    $oid: "612649aba1cb1e52b6af9bcb",
                },
                key: "de las cuales saturadas",
                value: "0,5 g",
            },
            {
                _id: {
                    $oid: "612649aba1cb1e52b6af9bcc",
                },
                key: "Hidratos de carbono",
                value: "14,5 g",
            },
            {
                _id: {
                    $oid: "612649aba1cb1e52b6af9bcd",
                },
                key: "de los cuales azúcares",
                value: "6,9 g",
            },
            {
                _id: {
                    $oid: "612649aba1cb1e52b6af9bce",
                },
                key: "Proteínas",
                value: "2,2 g",
            },
            {
                _id: {
                    $oid: "612649aba1cb1e52b6af9bcf",
                },
                key: "Sal",
                value: "0,1 g",
            },
        ],
        createdAt: {
            $date: "2021-08-25T13:46:19.542Z",
        },
        updatedAt: {
            $date: "2021-08-25T13:46:19.542Z",
        },
        __v: 0,
    },
    {
        _id: "8daba085-00d1-4d50-9e3c-e5f3d5ad656a",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Recipiente de horno", "Bandeja de horno"],
        availableMonths: [],
        availableWeeks: ["01531d68-3712-4a2e-8891-f03a6092eed5"],
        relatedPlans: [],
        deletionFlag: true,
        recipeGeneralData: {
            _id: {
                $oid: "612e6abc97e12f48c36e9e20",
            },
            name: "test",
            recipeDescription: {
                _id: {
                    $oid: "612e6abc97e12f48c36e9e21",
                },
                shortDescription: "test",
                longDescription: "test",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612e6abc97e12f48c36e9e22",
                },
                timeValue: 1,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612e6abc97e12f48c36e9e23",
                },
                weightValue: 11,
                weightUnit: "gr",
            },
            sku: "test",
            imageUrl: "development/recipes/test/test",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: ["Colita", "Secreto ibérico", "Carne de ternera"],
                _id: {
                    $oid: "612e6abc97e12f48c36e9e24",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "test",
            },
        ],
        nutritionalInfo: [],
        createdAt: {
            $date: "2021-08-31T17:45:32.533Z",
        },
        updatedAt: {
            $date: "2021-08-31T17:46:16.891Z",
        },
        __v: 0,
    },
    {
        _id: "c387dd65-a6fc-483e-bee0-f457803848b9",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Cuchillo", "Tabla de cortar", "Rallador", "Bol x2", "Sartén"],
        availableMonths: [],
        availableWeeks: ["01531d68-3712-4a2e-8891-f03a6092eed5"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "612e6afc97e12f48c36e9ed9",
            },
            name: "Chuletas de cerdo marinadas",
            recipeDescription: {
                _id: {
                    $oid: "612e6afc97e12f48c36e9eda",
                },
                shortDescription: "eliminar",
                longDescription: "Chuletas de cerdo marinadas con coleslaw",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612e6afc97e12f48c36e9edb",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612e6afc97e12f48c36e9edc",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0198",
            imageUrl: "development/recipes/Chuletas_de_cerdo_marinadas/Chuletas_de_cerdo_marinadas",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Chuletas de cerdo",
                    "Ajo",
                    "Zanahoria",
                    "Jengibre fresco",
                    "Col blanca",
                    "Lima",
                    "Yogur natural",
                    "Semillas de apio",
                    "Wasabi",
                    "Salsa de soja",
                ],
                _id: {
                    $oid: "612e6afc97e12f48c36e9edd",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0198",
            },
            {
                ingredients: [
                    "Chuletas de cerdo",
                    "Ajo",
                    "Zanahoria",
                    "Jengibre fresco",
                    "Col blanca",
                    "Lima",
                    "Yogur natural",
                    "Semillas de apio",
                    "Wasabi",
                    "Salsa de soja sin gluten",
                ],
                _id: {
                    $oid: "612e6afc97e12f48c36e9ede",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0198GL",
            },
            {
                ingredients: [
                    "Chuletas de cerdo",
                    "Ajo",
                    "Zanahoria",
                    "Jengibre fresco",
                    "Col blanca",
                    "Lima",
                    "Yogur de soja",
                    "Semillas de apio",
                    "Wasabi",
                    "Salsa de soja sin gluten",
                ],
                _id: {
                    $oid: "612e6afc97e12f48c36e9edf",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R198LG",
            },
            {
                ingredients: [
                    "Chuletas de cerdo",
                    "Ajo",
                    "Zanahoria",
                    "Jengibre fresco",
                    "Col blanca",
                    "Lima",
                    "Yogur de soja",
                    "Semillas de apio",
                    "Wasabi",
                    "Salsa de soja",
                ],
                _id: {
                    $oid: "612e6afc97e12f48c36e9ee0",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0198LA",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "612e6afc97e12f48c36e9ee1",
                },
                key: "Valor energético",
                value: "69,7 Kcal",
            },
            {
                _id: {
                    $oid: "612e6afc97e12f48c36e9ee2",
                },
                key: "Grasas",
                value: "3,1 g",
            },
            {
                _id: {
                    $oid: "612e6afc97e12f48c36e9ee3",
                },
                key: "de las cuales saturadas",
                value: "1,2 g",
            },
            {
                _id: {
                    $oid: "612e6afc97e12f48c36e9ee4",
                },
                key: "Hidratos de carbono",
                value: "4,7 g",
            },
            {
                _id: {
                    $oid: "612e6afc97e12f48c36e9ee5",
                },
                key: "de los cuales azúcares",
                value: "1,5 g",
            },
            {
                _id: {
                    $oid: "612e6afc97e12f48c36e9ee6",
                },
                key: "Proteínas",
                value: "6,1 g",
            },
            {
                _id: {
                    $oid: "612e6afc97e12f48c36e9ee7",
                },
                key: "Sal",
                value: "0,3 g",
            },
        ],
        createdAt: {
            $date: "2021-08-31T17:46:36.927Z",
        },
        updatedAt: {
            $date: "2021-08-31T17:46:36.927Z",
        },
        __v: 0,
    },
    {
        _id: "ca4f5bf2-b0e0-4780-b516-4c8256e0295e",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Sartén", "Bandeja de horno", "Olla pequeña", "Bol pequeño"],
        availableMonths: [],
        availableWeeks: ["01531d68-3712-4a2e-8891-f03a6092eed5"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "612e6dc797e12f48c36ea0c8",
            },
            name: "Pollo Teriyaki",
            recipeDescription: {
                _id: {
                    $oid: "612e6dc797e12f48c36ea0c9",
                },
                shortDescription: "eliminar",
                longDescription: "Pollo Teriyaki con brócoli asado y arroz con sésamo",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612e6dc797e12f48c36ea0ca",
                },
                timeValue: 25,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612e6dc797e12f48c36ea0cb",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0044",
            imageUrl: "development/recipes/Pollo_Teriyaki/Pollo_Teriyaki",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Brócoli",
                    "Naranja",
                    "Arroz jazmin",
                    "Sésamo tostado",
                    "Miel",
                    "Aceite de sésamo",
                    "Salsa de soja",
                    "Vinagre de arroz",
                    "Balsámico caramelizado",
                ],
                _id: {
                    $oid: "612e6dc797e12f48c36ea0cc",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0044",
            },
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Brócoli",
                    "Naranja",
                    "Arroz jazmin",
                    "Sésamo tostado",
                    "Miel",
                    "Aceite de sésamo",
                    "Salsa de soja",
                    "Vinagre de arroz",
                    "Balsámico caramelizado",
                ],
                _id: {
                    $oid: "612e6dc797e12f48c36ea0cd",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0044",
            },
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Brócoli",
                    "Naranja",
                    "Arroz jazmin",
                    "Sésamo tostado",
                    "Miel",
                    "Aceite de sésamo",
                    "Vinagre de arroz",
                    "Balsámico caramelizado",
                    "Salsa de soja sin gluten",
                ],
                _id: {
                    $oid: "612e6dc797e12f48c36ea0ce",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0044GL",
            },
            {
                ingredients: [
                    "Pechuga de pollo",
                    "Brócoli",
                    "Naranja",
                    "Arroz jazmin",
                    "Sésamo tostado",
                    "Miel",
                    "Aceite de sésamo",
                    "Vinagre de arroz",
                    "Balsámico caramelizado",
                    "Salsa de soja sin gluten",
                ],
                _id: {
                    $oid: "612e6dc797e12f48c36ea0cf",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0044GL",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "612e6dc797e12f48c36ea0d0",
                },
                key: "Valor energético",
                value: "165,7 Kcal",
            },
            {
                _id: {
                    $oid: "612e6dc797e12f48c36ea0d1",
                },
                key: "Grasas",
                value: "6,7 g",
            },
            {
                _id: {
                    $oid: "612e6dc797e12f48c36ea0d2",
                },
                key: "de las cuales saturadas",
                value: "1,6 g",
            },
            {
                _id: {
                    $oid: "612e6dc797e12f48c36ea0d3",
                },
                key: "Hidratos de carbono",
                value: "9,2 g",
            },
            {
                _id: {
                    $oid: "612e6dc797e12f48c36ea0d4",
                },
                key: "de los cuales azúcares",
                value: "1,8 g",
            },
            {
                _id: {
                    $oid: "612e6dc797e12f48c36ea0d5",
                },
                key: "Proteínas",
                value: "14,4 g",
            },
            {
                _id: {
                    $oid: "612e6dc797e12f48c36ea0d6",
                },
                key: "Sal",
                value: "0,1 g",
            },
        ],
        createdAt: {
            $date: "2021-08-31T17:58:31.330Z",
        },
        updatedAt: {
            $date: "2021-08-31T17:58:31.330Z",
        },
        __v: 0,
    },
    {
        _id: "2f9d6387-5860-4171-852a-935b2ae3bfd1",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Tabla de cortar", "Cuchillo", "Olla", "Sartén"],
        availableMonths: [],
        availableWeeks: ["01531d68-3712-4a2e-8891-f03a6092eed5"],
        relatedPlans: [
            "10ff7d25-527b-4775-a23c-26133aefa84e",
            "d9770490-52ef-4441-8b63-b3d0bcdf1b2b",
            "81b61bc7-d8b7-45aa-945c-9bc8e7c68be2",
            "60ff8bc4-899a-46cf-b40e-359cefa3518d",
            "e2917714-dd6d-43a0-bc89-326adcc3b85f",
        ],
        deletionFlag: false,
        recipeGeneralData: {
            _id: {
                $oid: "612e6f6597e12f48c36ea26d",
            },
            name: "Curry amarillo de coliflor",
            recipeDescription: {
                _id: {
                    $oid: "612e6f6597e12f48c36ea26e",
                },
                shortDescription: "eliminar",
                longDescription: "Curry amarillo de coliflor con tofu especiado",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612e6f6597e12f48c36ea26f",
                },
                timeValue: 30,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612e6f6597e12f48c36ea270",
                },
                weightValue: 1,
                weightUnit: "gr",
            },
            sku: "R0203",
            imageUrl: "development/recipes/Curry_amarillo_de_coliflor/Curry_amarillo_de_coliflor",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: [
                    "Ajo",
                    "Coliflor",
                    "Zanahoria",
                    "Cilantro",
                    "Jengibre fresco",
                    "Lima",
                    "Arroz basmati",
                    "Pasas",
                    "Curry en polvo",
                    "Leche de coco",
                    "Curry amarillo",
                    "Tofu",
                ],
                _id: {
                    $oid: "612e6f6597e12f48c36ea271",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "R0203",
            },
            {
                ingredients: [
                    "Ajo",
                    "Coliflor",
                    "Zanahoria",
                    "Cilantro",
                    "Jengibre fresco",
                    "Lima",
                    "Arroz basmati",
                    "Pasas",
                    "Curry en polvo",
                    "Leche de coco",
                    "Curry amarillo",
                    "Tofu",
                ],
                _id: {
                    $oid: "612e6f6597e12f48c36ea272",
                },
                restriction: "13a03b53-c5e7-4e91-818d-93454ea7610c",
                sku: "R0203",
            },
            {
                ingredients: [
                    "Ajo",
                    "Coliflor",
                    "Zanahoria",
                    "Cilantro",
                    "Jengibre fresco",
                    "Lima",
                    "Arroz basmati",
                    "Pasas",
                    "Curry en polvo",
                    "Leche de coco",
                    "Curry amarillo",
                    "Tofu",
                ],
                _id: {
                    $oid: "612e6f6597e12f48c36ea273",
                },
                restriction: "0a4823ca-f92d-420e-8df0-fd5585a74e96",
                sku: "R0203",
            },
            {
                ingredients: [
                    "Ajo",
                    "Coliflor",
                    "Zanahoria",
                    "Cilantro",
                    "Jengibre fresco",
                    "Lima",
                    "Arroz basmati",
                    "Pasas",
                    "Curry en polvo",
                    "Leche de coco",
                    "Curry amarillo",
                    "Tofu",
                ],
                _id: {
                    $oid: "612e6f6597e12f48c36ea274",
                },
                restriction: "395ea2e5-23cb-44a9-8aa5-f7c89194e141",
                sku: "R0203",
            },
            {
                ingredients: [
                    "Ajo",
                    "Coliflor",
                    "Zanahoria",
                    "Cilantro",
                    "Jengibre fresco",
                    "Lima",
                    "Arroz basmati",
                    "Pasas",
                    "Curry en polvo",
                    "Leche de coco",
                    "Curry amarillo",
                    "Tofu",
                ],
                _id: {
                    $oid: "612e6f6597e12f48c36ea275",
                },
                restriction: "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685",
                sku: "R0203",
            },
            {
                ingredients: [
                    "Ajo",
                    "Coliflor",
                    "Zanahoria",
                    "Cilantro",
                    "Jengibre fresco",
                    "Lima",
                    "Arroz basmati",
                    "Pasas",
                    "Curry en polvo",
                    "Leche de coco",
                    "Curry amarillo",
                    "Tofu",
                ],
                _id: {
                    $oid: "612e6f6597e12f48c36ea276",
                },
                restriction: "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c",
                sku: "R0203",
            },
        ],
        nutritionalInfo: [
            {
                _id: {
                    $oid: "612e6f6597e12f48c36ea277",
                },
                key: "Valor energético",
                value: "84,7 Kcal",
            },
            {
                _id: {
                    $oid: "612e6f6597e12f48c36ea278",
                },
                key: "Grasas",
                value: "4,6 g",
            },
            {
                _id: {
                    $oid: "612e6f6597e12f48c36ea279",
                },
                key: "de las cuales saturadas",
                value: "3,3 g",
            },
            {
                _id: {
                    $oid: "612e6f6597e12f48c36ea27a",
                },
                key: "Hidratos de carbono",
                value: "9,7 g",
            },
            {
                _id: {
                    $oid: "612e6f6597e12f48c36ea27b",
                },
                key: "de los cuales azúcares",
                value: "2,9 g",
            },
            {
                _id: {
                    $oid: "612e6f6597e12f48c36ea27c",
                },
                key: "Proteínas",
                value: "3,1 g",
            },
            {
                _id: {
                    $oid: "612e6f6597e12f48c36ea27d",
                },
                key: "Sal",
                value: "0,2 g",
            },
        ],
        createdAt: {
            $date: "2021-08-31T18:05:25.371Z",
        },
        updatedAt: {
            $date: "2021-08-31T18:05:25.371Z",
        },
        __v: 0,
    },
    {
        _id: "16a2edab-51df-4da6-9429-e799f9925e01",
        imageTags: [],
        backOfficeTags: [],
        tools: ["Cuchillo"],
        availableMonths: [],
        availableWeeks: [],
        relatedPlans: [],
        deletionFlag: true,
        recipeGeneralData: {
            _id: {
                $oid: "612e9c58fc31706859d46936",
            },
            name: "Test imagen pesada",
            recipeDescription: {
                _id: {
                    $oid: "612e9c58fc31706859d46937",
                },
                shortDescription: "Test imagen pesada",
                longDescription: "Test imagen pesada",
            },
            recipeCookDuration: {
                _id: {
                    $oid: "612e9c58fc31706859d46938",
                },
                timeValue: 50,
                timeUnit: "m",
            },
            recipeWeight: {
                _id: {
                    $oid: "612e9c58fc31706859d46939",
                },
                weightValue: 40,
                weightUnit: "gr",
            },
            sku: "Test imagen pesada",
            imageUrl: "development/recipes/Test_imagen_pesada/Test_imagen_pesada",
            difficultyLevel: "Facil",
        },
        recipeVariants: [
            {
                ingredients: ["Secreto ibérico"],
                _id: {
                    $oid: "612e9c58fc31706859d4693a",
                },
                restriction: "27b8f2f5-4741-4cb5-9c05-4928c2d62928",
                sku: "asda",
            },
        ],
        nutritionalInfo: [],
        createdAt: {
            $date: "2021-08-31T21:17:12.350Z",
        },
        updatedAt: {
            $date: "2021-08-31T21:17:18.406Z",
        },
        __v: 0,
    },
];

const prodRestrictionMapIds: { [prodId: string]: string } = {
    "13a03b53-c5e7-4e91-818d-93454ea7610c": "7f293e6c-c05b-4348-93a6-6b23f1caa4ab", // Apto vegano sin gluten
    "0a4823ca-f92d-420e-8df0-fd5585a74e96": "40fa2daf-4853-44a6-a365-857bf50a81e9", // Sin lactosa
    "395ea2e5-23cb-44a9-8aa5-f7c89194e141": "f15c1e96-db74-4342-83f6-1b5a7e5a90a6", // Sin gluten
    "fa2244c2-b6c5-43a3-9fdf-3b04c1f55685": "3ee6ca13-bc2c-4580-be90-8ddd184b3fbc", // Sin gluten y sin lactosa
    "27b8f2f5-4741-4cb5-9c05-4928c2d62928": "e8a9ee3c-5122-4ddf-9386-1dd613f7ee22", // Apto todo
    "3ace8c1c-d5e9-4e68-b6c8-1f8f7533101c": "bc7f9a2a-5574-4872-9a2e-4daa7777dee5", // Apto vegano
};

export const uploadProdRecipes = async () => {
    const prodRecipes: Recipe[] = [];
    const ingredients = await mongooseIngredientRepository.findAll(Locale.es);
    const ingredientNameMap: { [ingredientName: string]: Ingredient } = {};
    const restrictions = await mongooseRecipeVariantRestrictionRepository.findAll();
    const restrictionMap: { [restrictionId: string]: RecipeVariantRestriction } = {};

    for (let ing of ingredients) {
        ingredientNameMap[ing.name] = ing;
    }

    for (let res of restrictions) {
        restrictionMap[res.id.value] = res;
    }

    for (let baseRecipe of baseProdRecipes) {
        //@ts-ignore
        baseRecipe.recipeGeneralData.imagesUrls = [baseRecipe.recipeGeneralData.imageUrl];
        const recipeGeneralData = recipeGeneralDataMapper.toDomain(baseRecipe.recipeGeneralData);
        const recipeVariants: RecipeVariant[] = [];
        const recipeTags: RecipeTag[] = [];
        const backOfficeRecipeTags: RecipeTag[] = [];
        const nutritionalInfoItems: NutritionalItem[] = [];
        const months: Month[] = [];

        for (let variant of baseRecipe.recipeVariants) {
            const ingredients: Ingredient[] = [];

            for (let ing of variant.ingredients) {
                if (!!ingredientNameMap[ing]) ingredients.push(ingredientNameMap[ing]);
            }

            recipeVariants.push(
                new RecipeVariant(
                    ingredients,
                    restrictionMap[prodRestrictionMapIds[variant.restriction]],
                    new RecipeVariantSku(variant.sku)
                )
            );
        }

        for (let tag of baseRecipe.imageTags) {
            recipeTags.push(new RecipeTag(tag));
        }

        for (let tag of baseRecipe.backOfficeTags) {
            backOfficeRecipeTags.push(new RecipeTag(tag));
        }

        for (let nInfo of baseRecipe.nutritionalInfo) {
            nutritionalInfoItems.push(new NutritionalItem(nInfo.key, nInfo.value));
        }

        for (let month of baseRecipe.availableMonths) {
            months.push((<any>Month)[month]);
        }

        const recipe = new Recipe(
            recipeGeneralData,
            recipeVariants,
            recipeTags,
            backOfficeRecipeTags,
            new RecipeNutritionalData(nutritionalInfoItems),
            [],
            months,
            [],
            baseRecipe.tools,
            new RecipeId(baseRecipe._id)
        );

        prodRecipes.push(recipe);
    }

    await mongooseRecipeRepository.bulkSave(prodRecipes);
};
