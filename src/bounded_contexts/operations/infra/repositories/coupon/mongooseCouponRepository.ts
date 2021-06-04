import { Coupon } from "../../../domain/cupons/Cupon";
import { PlanId } from "../../../domain/plan/PlanId";
import { ICouponRepository } from "./ICouponRepository";
import { Coupon as MongooseCoupon } from "../../../../../infraestructure/mongoose/models";
import { couponMapper } from "../../../mappers/couponMapper";
import { Locale } from "../../../domain/locale/Locale";
import { logger } from "../../../../../../config";

export class MongooseCouponRepository implements ICouponRepository {
    public async save(coupon: Coupon): Promise<void> {
        const couponDb = couponMapper.toPersistence(coupon);
        console.log("Test: ", couponDb)
        if (await MongooseCoupon.exists({ _id: coupon.couponCode })) {
            await MongooseCoupon.updateOne({ _id: coupon.couponCode });
        } else {
            await MongooseCoupon.create(couponDb);
        }
    }

    // private getRawPlanWithLocaleForUpdatingIt(planDb: any, locale: Locale): any {
    //     const { name, description, ...planToUpdate } = planDb;
    //     const nameLocaleKey = `name.${locale}`;
    //     const descriptionLocaleKey = `description.${locale}`;
    //     const imageWithLocale = `imageUrl.${locale}`;

    //     return {
    //         ...planToUpdate,
    //         $set: {
    //             [nameLocaleKey]: name[locale],
    //             [descriptionLocaleKey]: description[locale],
    //             // "variants.$[planVariant].attributes": this.getRawPlanVariantsWithLocaleForUpdatingThem(planDb.variants, locale),
    //         },
    //     };
    // }

    // private getRawPlanVariantsWithLocaleForUpdatingThem(planVariants: any[], locale: Locale): any {
    //     return planVariants.map((pv) => {
    //         const attributesWithLocale = pv.attributes.map((attribute: any) => {
    //             const { key, value, ...attributeToUpdate } = attribute;
    //             const keyLocale = `key.${locale}`;
    //             const valueLocale = `value.${locale}`;

    //             return { ...attributeToUpdate, [keyLocale]: key[locale], [valueLocale]: value[locale] };
    //         });

    //         return { ...pv, attributes: attributesWithLocale };
    //     });
    // }

    // public async findById(planId: PlanId, locale: Locale): Promise<Plan | undefined> {
    //     const planDb = await MongoosePlan.findById(planId.value, { deletionFlag: false }).populate("additionalPlans");

    //     return planDb ? planMapper.toDomain(planDb, locale) : undefined;
    // }

    public async findAll(): Promise<Coupon[]> {
        return await this.findBy({});
    }

    // public async findAdditionalPlanList(locale: Locale): Promise<Plan[]> {
    //     return await this.findBy({ type: "Adicional" }, locale);
    // }

    // public async findAdditionalPlanListById(ids: PlanId[], locale: Locale): Promise<Plan[]> {
    //     return await this.findBy({ _id: ids, type: "Adicional" }, locale);
    // }

    public async findBy(conditions: any): Promise<Coupon[]> {
        const couponsDb = await MongooseCoupon.find({ ...conditions, deletionFlag: false })
        // console.log("Response: ",couponsDb)
        return couponsDb.map((raw: any) => couponMapper.toDomain(raw));
    }

    // public async findAllWithRecipesFlag(locale: Locale): Promise<Plan[]> {
    //     return await this.findBy({ hasRecipes: true }, locale);
    // }

    // public async delete(planId: PlanId): Promise<void> {
    //     await MongoosePlan.updateOne({ _id: planId.value }, { deletionFlag: true });
    // }
}
