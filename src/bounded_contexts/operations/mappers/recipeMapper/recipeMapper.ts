import { recipeGeneralDataMapper, recipeVariantMapper } from ".";
import { weekMapper } from "..";
import { Mapper } from "../../../../core/infra/Mapper";
import { Locale } from "../../domain/locale/Locale";
import { PlanId } from "../../domain/plan/PlanId";
import { Month } from "../../domain/recipe/Months";
import { Recipe } from "../../domain/recipe/Recipe";
import { RecipeGeneralData } from "../../domain/recipe/RecipeGeneralData/RecipeGeneralData";
import { RecipeId } from "../../domain/recipe/RecipeId";
import { NutritionalItem } from "../../domain/recipe/RecipeNutritionalData/NutritionalItem";
import { RecipeNutritionalData } from "../../domain/recipe/RecipeNutritionalData/RecipeNutritionalData";
import { RecipeTag } from "../../domain/recipe/RecipeTag";
import { RecipeVariant } from "../../domain/recipe/RecipeVariant/RecipeVariant";
import { Week } from "../../domain/week/Week";

export class RecipeMapper implements Mapper<Recipe> {
    public toDomain(raw: any, locale?: Locale): Recipe {
        const recipeGeneralData: RecipeGeneralData = recipeGeneralDataMapper.toDomain(raw.recipeGeneralData, locale);
        const recipeVariants: RecipeVariant[] = raw.recipeVariants.map((variant: any) => recipeVariantMapper.toDomain(variant, locale));
        const imageTags: RecipeTag[] = raw.imageTags[locale ?? Locale.es].map((tag: string) => new RecipeTag(tag));
        const backOfficeImageTags: RecipeTag[] = raw.backOfficeTags.map((tag: any) => new RecipeTag(tag));
        const availableWeeks: Week[] = raw.availableWeeks.map((rawWeek: any) => weekMapper.toDomain(rawWeek));
        const availableMonths: Month[] = raw.availableMonths.map((month: any) => (<any>Month)[month]);
        const relatedPlansIds: PlanId[] = raw.relatedPlans.map((id: string) => new PlanId(id));
        const recipeTools: string[] = raw.tools;
        const nutritionalItems: NutritionalItem[] = raw.nutritionalInfo.map(
            (item: { [locale: string]: { key: string; value: string } }) => {
                return new NutritionalItem(item[locale ?? "es"].key, item[locale ?? "es"].value, item["_id"].toString());
            }
        );
        const recipeNutritionalData: RecipeNutritionalData = new RecipeNutritionalData(nutritionalItems);
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
            new RecipeId(raw._id),
            raw.orderPriority || 999
        );
    }

    public toPersistence(t: Recipe, locale?: Locale) {
        const recipeGeneralData = recipeGeneralDataMapper.toPersistence(t.recipeGeneralData, locale);
        const recipeVariants = t.recipeVariants.map((variant) => recipeVariantMapper.toPersistence(variant, locale));
        const availableWeeks = t.availableWeeks.map((week) => week.id.value);
        const backOfficeTags = t.recipeBackOfficeTags.map((tag) => tag.name);
        const relatedPlans = t.relatedPlans.map((planId) => planId.value);
        const nutritionalInfo = t.recipeNutritionalData.nutritionalItems.map((item) => ({
            key: item.key,
            value: item.value,
            _id: item.id,
        }));
        const imageTags = t.recipeImageTags.map((tag) => tag.name);

        return {
            recipeGeneralData,
            recipeVariants,
            tools: t.recipeTools,
            availableMonths: t.availableMonths,
            availableWeeks,
            relatedPlans,
            nutritionalInfo,
            backOfficeTags,
            imageTags,
            orderPriority: t.orderPriority || 999,
        };
    }
}
