import { DeleteRecipeVariant } from "./deleteRecipeVariant";
import { DeleteRecipeVariantController } from "./deleteRecipeVariantController";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";

export const deleteRecipeVariant: DeleteRecipeVariant = new DeleteRecipeVariant(
    mongooseRecipeRepository,
    mongooseOrderRepository,
    mongooseSubscriptionRepository
);
export const deleteRecipeVariantController: DeleteRecipeVariantController = new DeleteRecipeVariantController(deleteRecipeVariant);
