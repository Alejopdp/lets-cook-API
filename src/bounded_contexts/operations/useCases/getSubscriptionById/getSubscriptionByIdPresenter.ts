import { Customer } from "../../domain/customer/Customer";
import { Order } from "../../domain/order/Order";
import { Subscription } from "../../domain/subscription/Subscription";
import { v4 as uuid } from "uuid";
import { IStorageService } from "../../application/storageService/IStorageService";

export class GetSubscriptionByIdPresenter {
    private _storageService: IStorageService;

    constructor(storageService: IStorageService) {
        this._storageService = storageService;
    }

    public present(subscription: Subscription, orders: Order[], customer: Customer): any {
        const presentedPlan = {
            planName: subscription.plan.name,
            state: subscription.state.humanTitle,
            servingsQty: 4, // Recipes * personsQty
            servingPrice: 3, // Price / servingsQty
            price: subscription.plan.getPlanVariantById(subscription.planVariantId)?.getPaymentPrice(),
        };

        const shippingAddress = {
            addressName: customer.shippingAddress?.name,
            addressDetails: customer.shippingAddress?.details,
            preferredSchedule: "Hardcoded",
        };

        const billingData = {
            addressName: customer.billingAddress?.name,
            addressDetails: customer.billingAddress?.details,
            name: "Alejo Scotti (Hardcoded)",
        };

        const paymentMethods = [
            {
                id: uuid(),
                cardBrand: "Visa (Hardcoded)",
                last4: "4242 (Hardcoded)",
                expirationDate: "10/25 (Hardcoded)",
                default: true,
            },
            {
                id: uuid(),
                cardBrand: "Visa (Hardcoded)",
                last4: "4242 (Hardcoded)",
                default: false,
            },
        ];

        const schedule = {
            nextDelivery: orders[0].shippingDate,
            nextPayment: orders[1].billingDate,
        };

        const hasChosenRecipesForActualWeek = orders[0].recipes.length > 0;
        const hasChosenRecipesForNextWeek = orders[1].recipes.length > 0;
        const actualWeekRecipes = orders[0].recipes.map((recipe) => ({
            id: recipe.id.value,
            name: recipe.recipeGeneralData.name,
            imageUrl: this.storageService.getPresignedUrlForFile(recipe.recipeGeneralData.imageUrl), // TO DO: Presign
            restrictions: recipe.getVariantRestrictions(
                orders[0].recipesVariantsIds.filter((variantId) => recipe.recipeVariants.some((variant) => variant.id.equals(variantId)))[0]
            ),
        }));
        const nextWeekRecipes = orders[0].recipes.map((recipe) => ({
            id: recipe.id.value,
            name: recipe.recipeGeneralData.name,
            imageUrl: this.storageService.getPresignedUrlForFile(recipe.recipeGeneralData.imageUrl), // TO DO: Presign
            restrictions: recipe.getVariantRestrictions(
                orders[0].recipesVariantsIds.filter((variantId) => recipe.recipeVariants.some((variant) => variant.id.equals(variantId)))[0]
            ),
        }));

        const skippedOrders = orders
            .filter((order) => order.isSkipped())
            .map((order) => ({ id: order.id.value, label: order.getWeekLabel() }));

        // const canChooseRecipes = subscription.plan.canChooseRecipes()
        const canChooseRecipes = true;

        return {
            plan: presentedPlan,
            shippingAddress,
            billingData,
            paymentMethods,
            schedule,
            hasChosenRecipesForActualWeek,
            hasChosenRecipesForNextWeek,
            actualWeekRecipes,
            nextWeekRecipes,
            skippedOrders,
            canChooseRecipes,
        };
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
