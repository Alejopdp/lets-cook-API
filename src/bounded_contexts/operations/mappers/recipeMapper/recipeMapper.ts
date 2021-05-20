// import { recipeGeneralDataMapper, recipeVariantMapper } from ".";
// import { Mapper } from "../../../../core/infra/Mapper";
// import { Locale } from "../../domain/locale/Locale";
// import { Recipe } from "../../domain/recipe/Recipe";
// import { RecipeGeneralData } from "../../domain/recipe/RecipeGeneralData/RecipeGeneralData";
// import { RecipeTag } from "../../domain/recipe/RecipeTag";
// import { RecipeVariant } from "../../domain/recipe/RecipeVariant/RecipeVariant";

// export class RecipeMapper implements Mapper<Recipe> {
//     public toDomain(raw: any, locale?: Locale): Recipe {
//         const recipeGeneralData: RecipeGeneralData = recipeGeneralDataMapper.toDomain(raw.recipeGeneralData, locale);
//         const recipeVariants: RecipeVariant[] = raw.recipeVariants.map((variant: any) => recipeVariantMapper.toDomain(variant));
//         const imageTags: RecipeTag[] = raw.imageTags.map((tag: any) => new RecipeTag(tag));
//         const backOfficeImageTags: RecipeTag[] = raw.imageTags.map((tag: any) => new RecipeTag(tag));

//         // return new Recipe(recipeGeneralData, recipeVariants, imageTags, backOfficeImageTags, [], );
//     }
//     public toPersistence(t: Recipe, locale?: Locale) {
//         throw new Error("Method not implemented.");
//     }
// }
