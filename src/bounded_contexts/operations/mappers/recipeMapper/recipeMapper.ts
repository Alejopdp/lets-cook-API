import { recipeGeneralDataMapper, recipeVariantMapper } from ".";
import { weekMapper } from "..";
import { Mapper } from "../../../../core/infra/Mapper";
import { Locale } from "../../domain/locale/Locale";
import { PlanId } from "../../domain/plan/PlanId";
import { Month } from "../../domain/recipe/Months";
import { Recipe } from "../../domain/recipe/Recipe";
import { RecipeGeneralData } from "../../domain/recipe/RecipeGeneralData/RecipeGeneralData";
import { RecipeId } from "../../domain/recipe/RecipeId";
import { RecipeNutritionalData } from "../../domain/recipe/RecipeNutritionalData/RecipeNutritionalData";
import { RecipeTag } from "../../domain/recipe/RecipeTag";
import { RecipeVariant } from "../../domain/recipe/RecipeVariant/RecipeVariant";
import { Week } from "../../domain/week/Week";

export class RecipeMapper implements Mapper<Recipe> {
    public toDomain(raw: any, locale?: Locale): Recipe {
        const recipeGeneralData: RecipeGeneralData = recipeGeneralDataMapper.toDomain(raw.recipeGeneralData, locale);
        const recipeVariants: RecipeVariant[] = raw.recipeVariants.map((variant: any) => recipeVariantMapper.toDomain(variant));
        const imageTags: RecipeTag[] = raw.imageTags.map((tag: any) => new RecipeTag(tag));
        const backOfficeImageTags: RecipeTag[] = raw.imageTags.map((tag: any) => new RecipeTag(tag));
        const availableWeeks: Week[] = raw.availableWeeks.map((rawWeek: any) => weekMapper.toDomain(rawWeek));
        const availableMonths: Month[] = raw.availableMonths.map((month: any) => (<any>Month)[month]);
        const relatedPlansIds: PlanId[] = raw.relatedPlans.map((id: string) => new PlanId(id));
        const recipeTools: string[] = raw.tools;
        const recipeNutritionalData: RecipeNutritionalData = new RecipeNutritionalData([]);

        return new Recipe(
            recipeGeneralData,
            recipeVariants,
            imageTags,
            backOfficeImageTags,
            recipeNutritionalData,
            availableWeeks,
            availableMonths,
            relatedPlansIds,
            recipeTools,
            new RecipeId(raw._id)
        );
    }
    public toPersistence(t: Recipe, locale?: Locale) {
        const recipeGeneralData = recipeGeneralDataMapper.toPersistence(t.recipeGeneralData);
        const recipeVariants = t.recipeVaraints.map((variant) => recipeVariantMapper.toPersistence(variant));
        const availableWeeks = t.availableWeeks.map((week) => week.id.value);
        const backOfficeTags = t.recipeBackOfficeTags.map((tag) => tag.name);
        const relatedPlans = t.relatedPlans.map((planId) => planId.value);
        const imageTags = t.recipeImageTags.map((tag) => tag.name);

        return {
            recipeGeneralData,
            recipeVariants,
            tools: t.recipeTools,
            availableMonths: t.availableMonths,
            availableWeeks,
            relatedPlans,
            backOfficeTags,
            imageTags,
        };
    }
}
