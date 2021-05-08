import { Plan } from "../../../domain/plan/Plan";
import { PlanId } from "../../../domain/plan/PlanId";
import { IPlanRepository } from "./IPlanRepository";
import { Plan as MongoosePlan } from "../../../../../infraestructure/mongoose/models";
import { planMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";

export class MongoosePlanRepository implements IPlanRepository {
    public async save(plan: Plan): Promise<void> {
        const planDb = planMapper.toPersistence(plan);
        if (await MongoosePlan.exists({ _id: plan.id.value })) {
            const { name, description, ...planToUpdate } = planDb;
            const nameLocaleKey = `name.${plan.locale}`;
            const descriptionLocaleKey = `description.${plan.locale}`;
            const imageWithLocale = `imageUrl.${plan.locale}`;

            await MongoosePlan.updateOne(
                { _id: plan.id.value },
                { ...planToUpdate, $set: { [nameLocaleKey]: name[plan.locale], [descriptionLocaleKey]: description[plan.locale] } }
            );
        } else {
            await MongoosePlan.create(planDb);
        }
    }

    public async findById(planId: PlanId, locale: Locale): Promise<Plan | undefined> {
        const planDb = await MongoosePlan.findById(planId.value, { deletionFlag: false });

        return planDb ? planMapper.toDomain(planDb, locale) : undefined;
    }

    public async findAll(locale: Locale): Promise<Plan[]> {
        return await this.findBy({}, locale);
    }

    public async findAdditionalPlanList(locale: Locale): Promise<Plan[]> {
        return await this.findBy({ type: "Additional" }, locale);
    }

    public async findBy(conditions: any, locale: Locale): Promise<Plan[]> {
        const plansDb = await MongoosePlan.find({ ...conditions, deletionFlag: false });

        return plansDb.map((raw: any) => planMapper.toDomain(raw, locale));
    }

    public async findAllWithRecipesFlag(locale: Locale): Promise<Plan[]> {
        return await this.findBy({ hasRecipes: true }, locale);
    }

    public async delete(planId: PlanId): Promise<void> {
        await MongoosePlan.updateOne({ _id: planId.value }, { deletionFlag: true });
    }
}
