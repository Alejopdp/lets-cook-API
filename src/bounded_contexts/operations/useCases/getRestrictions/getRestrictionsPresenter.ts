import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { v4 as uuid } from "uuid";
import { IStorageService } from "../../application/storageService/IStorageService";
import { PaymentMethod } from "../../domain/customer/paymentMethod/PaymentMethod";
import { RecipeVariantRestriction } from "../../domain/recipe/RecipeVariant/recipeVariantResitriction/RecipeVariantRestriction";

export class GetRestrictionsPresenter {
    public present(restrictions: RecipeVariantRestriction[]): any {
        return restrictions.map((restriction) => ({
            id: restriction.id.value,
            value: restriction.id.value,
            text: restriction.label,
        }));
    }
}
