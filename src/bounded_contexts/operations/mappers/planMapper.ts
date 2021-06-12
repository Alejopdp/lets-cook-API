import { planVariantMapper } from ".";
import { logger } from "../../../../config";
import { Mapper } from "../../../core/infra/Mapper";
import { Locale } from "../domain/locale/Locale";
import { Plan } from "../domain/plan/Plan";
import { PlanFrequency } from "../domain/plan/PlanFrequency";
import { PlanId } from "../domain/plan/PlanId";
import { PlanSku } from "../domain/plan/PlanSku";
import { PlanSlug } from "../domain/plan/PlanSlug";
import { PlanType } from "../domain/plan/PlanType/PlanType";
import { PlanVariant } from "../domain/plan/PlanVariant/PlanVariant";

export class PlanMapper implements Mapper<Plan> {
    public toDomain(raw: any, locale: Locale): Plan {
        const sku: PlanSku = new PlanSku(raw.sku);
        const type: PlanType = (<any>PlanType)[raw.type];
        const frequencies: PlanFrequency[] = raw.availableFrequencies.map((freq: string) => (<any>PlanFrequency)[freq]);
        const variants: PlanVariant[] = raw.variants.map((variant: any) => planVariantMapper.toDomain(variant));
        const additionalPlans: Plan[] = raw.additionalPlans.map((plan: any) => this.toDomain(plan, locale));
        const planSlug: PlanSlug = new PlanSlug(raw.slug);

        return Plan.create(
            raw.name[locale] || raw.name["es"],
            raw.description[locale] || raw.description["es"],
            sku,
            raw.imageUrl,
            raw.isActive,
            type,
            variants,
            frequencies,
            raw.hasRecipes,
            additionalPlans,
            locale,
            planSlug,
            raw.abilityToChooseRecipe,
            raw.iconLinealUrl,
            raw.iconLinealColorUrl,
            new PlanId(raw._id)
        );
    }
    public toPersistence(t: Plan): any {
        const variants: any[] = t.planVariants.map((variant) => planVariantMapper.toPersistence(variant));

        return {
            _id: t.id.value || undefined,
            name: { [t.locale]: t.name },
            description: { [t.locale]: t.description },
            sku: t.planSku.code,
            imageUrl: t.imageUrl,
            isActive: t.isActive,
            type: t.type,
            variants,
            hasRecipes: t.hasRecipes,
            availableFrequencies: t.availablePlanFrecuencies,
            additionalPlans: t.additionalPlans.map((plan: Plan) => plan.id.value),
            slug: t.planSlug.slug,
            abilityToChooseRecipe: t.abilityToChooseRecipe,
            iconLinealUrl: t.iconLinealUrl,
            iconLinealColorUrl: t.iconLinealColorUrl,
        };
    }
}
