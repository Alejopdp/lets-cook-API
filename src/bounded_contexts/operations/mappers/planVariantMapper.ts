import { logger } from "../../../../config";
import { Mapper } from "../../../core/infra/Mapper";
import { PlanSku } from "../domain/plan/PlanSku";
import { PlanVariant } from "../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantAttribute } from "../domain/plan/PlanVariant/PlanVariantAttribute";
import { PlanVariantId } from "../domain/plan/PlanVariant/PlanVariantId";
// import { PlanVariantWithRecipe } from "../domain/plan/PlanVariant/PlanVariantWithRecipes";
export class PlanVariantMapper implements Mapper<PlanVariant, any> {
    public toDomain(raw: any): PlanVariant {
        const attributes: PlanVariantAttribute[] = raw.attributes.map((attr: any) => new PlanVariantAttribute(attr.key, attr.value));

        return new PlanVariant(
            new PlanSku(raw.sku),
            raw.name,
            raw.price,
            attributes,
            raw.description,
            raw.isDefault,
            raw.isDeleted,
            raw.priceWithOffer,
            new PlanVariantId(raw._id),
            raw.numberOfPersons,
            raw.numberOfRecipes
        );
    }

    public toPersistence(t: PlanVariant) {
        return {
            numberOfPersons: t.numberOfPersons,
            numberOfRecipes: t.numberOfRecipes,
            sku: t.sku.code,
            name: t.name,
            price: t.price,
            priceWithOffer: t.priceWithOffer,
            attributes: t.attributes.map((attr: PlanVariantAttribute) => {
                return { key: attr.key, value: attr.value };
            }),
            _id: t.id.value,
            description: t.description,
            isDefault: t.isDefault,
            isDeleted: t.isDeleted,
        };
    }
}
