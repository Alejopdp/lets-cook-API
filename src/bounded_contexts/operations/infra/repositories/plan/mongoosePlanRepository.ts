import { Plan } from "../../../domain/plan/Plan";
import { PlanId } from "../../../domain/plan/PlanId";
import { IPlanRepository } from "./IPlanRepository";
import { Plan as MongoosePlan } from "../../../../../infraestructure/mongoose/models";
import { planMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";
import { logger } from "../../../../../../config";
import { PlanVariantId } from "../../../domain/plan/PlanVariant/PlanVariantId";
export class MongoosePlanRepository implements IPlanRepository {
    public async save(plan: Plan): Promise<void> {
        const planDb = planMapper.toPersistence(plan);
        if (await MongoosePlan.exists({ _id: plan.id.value })) {
            await MongoosePlan.updateOne({ _id: plan.id.value }, this.getRawPlanWithLocaleForUpdatingIt(planDb, plan.locale));
        } else {
            await MongoosePlan.create(planDb);
        }
    }

    private getRawPlanWithLocaleForUpdatingIt(planDb: any, locale: Locale): any {
        const { name, description, ...planToUpdate } = planDb;
        const nameLocaleKey = `name.${locale}`;
        const descriptionLocaleKey = `description.${locale}`;
        const imageWithLocale = `imageUrl.${locale}`;

        return {
            ...planToUpdate,
            $set: {
                [nameLocaleKey]: name[locale],
                [descriptionLocaleKey]: description[locale],
                // "variants.$[planVariant].attributes": this.getRawPlanVariantsWithLocaleForUpdatingThem(planDb.variants, locale),
            },
        };
    }

    private getRawPlanVariantsWithLocaleForUpdatingThem(planVariants: any[], locale: Locale): any {
        return planVariants.map((pv) => {
            const attributesWithLocale = pv.attributes.map((attribute: any) => {
                const { key, value, ...attributeToUpdate } = attribute;
                const keyLocale = `key.${locale}`;
                const valueLocale = `value.${locale}`;

                return { ...attributeToUpdate, [keyLocale]: key[locale], [valueLocale]: value[locale] };
            });

            return { ...pv, attributes: attributesWithLocale };
        });
    }

    public async bulkSave(plans: Plan[]): Promise<void> {
        const plansToSave = plans.map((plan) => planMapper.toPersistence(plan));

        await MongoosePlan.create(plansToSave);
    }

    public async findById(planId: PlanId, locale: Locale): Promise<Plan | undefined> {
        const planDb = await MongoosePlan.findById(planId.value, { deletionFlag: false }).populate("additionalPlans");

        return planDb ? planMapper.toDomain(planDb, locale) : undefined;
    }

    public async findAll(locale: Locale): Promise<Plan[]> {
        return await this.findBy({}, locale);
    }

    public async findAdditionalPlanList(locale: Locale): Promise<Plan[]> {
        return await this.findBy({ type: "Adicional" }, locale);
    }

    public async findAdditionalPlanListById(ids: PlanId[], locale: Locale): Promise<Plan[]> {
        return await this.findBy({ _id: ids, type: "Adicional" }, locale);
    }

    public async findBy(conditions: any, locale: Locale): Promise<Plan[]> {
        const plansDb = await MongoosePlan.find({ ...conditions, deletionFlag: false }).populate("additionalPlans");

        return plansDb.map((raw: any) => planMapper.toDomain(raw, locale));
    }

    public async findByPlanVariantId(planVariantId: PlanVariantId): Promise<Plan | undefined> {
        const planDb = await MongoosePlan.findOne({ "variants._id": planVariantId.value });

        return planDb ? planMapper.toDomain(planDb, Locale.es) : undefined;
    }

    public async findAllWithRecipesFlag(locale: Locale): Promise<Plan[]> {
        return await this.findBy({ hasRecipes: true }, locale);
    }

    public async delete(planId: PlanId): Promise<void> {
        await MongoosePlan.updateOne({ _id: planId.value }, { deletionFlag: true });
    }
}
