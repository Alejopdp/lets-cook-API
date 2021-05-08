import { logger } from "../../../../config";
import { Mapper } from "../../../core/infra/Mapper";
import { PlanSku } from "../domain/plan/PlanSku";
import { PlanVariant } from "../domain/plan/PlanVariant/PlanVariant";
import { PlanVariantAttribute } from "../domain/plan/PlanVariant/PlanVariantAttribute";
import { PlanVariantWithRecipe } from "../domain/plan/PlanVariant/PlanVariantWithRecipes";

export class PlanVariantMapper implements Mapper<PlanVariant> {
    public toDomain(raw: any): PlanVariant {
        const attributes: PlanVariantAttribute[] = raw.attributes.map((attr: any) => new PlanVariantAttribute(attr.key, attr.value));

        if (!!raw.numberOfPersons && !!raw.numberOfRecipes) {
            return new PlanVariantWithRecipe(
                raw.numberOfPersons,
                raw.numberOfRecipes,
                new PlanSku(raw.sku),
                raw.name,
                raw.price,
                raw.priceWithOffer,
                attributes
            );
        }

        return new PlanVariant(new PlanSku(raw.sku), raw.name, raw.price, attributes, raw.priceWithOffer);
    }

    public toPersistence(t: PlanVariant) {
        return {
            // @ts-ignore
            numberOfPersons: t.numberOfPersons,
            // @ts-ignore
            numberOfRecipes: t.numberOfRecipes,
            sku: t.sku.code,
            name: t.name,
            price: t.price,
            priceWithOffer: t.priceWithOffer,
            attributes: t.attributes.map((attr: PlanVariantAttribute) => {
                return { key: attr.key, value: attr.value };
            }),
        };
    }
}
