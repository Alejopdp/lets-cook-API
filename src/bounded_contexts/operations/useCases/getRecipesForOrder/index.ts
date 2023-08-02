import { v3S3Service } from "../../application/storageService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetRecipesForOrder } from "./getRecipesForOrder";
import { GetRecipesForOrderController } from "./getRecipesForOrderController";
import { GetRecipesForOrderPresenter } from "./getRecipesForOrderPresenter";

export const getRecipesForOrder: GetRecipesForOrder = new GetRecipesForOrder(
    mongooseOrderRepository,
    mongooseRecipeRepository,
    mongooseSubscriptionRepository
);
export const getRecipesForOrderPresenter: GetRecipesForOrderPresenter = new GetRecipesForOrderPresenter(v3S3Service);
export const getRecipesForOrderController: GetRecipesForOrderController = new GetRecipesForOrderController(
    getRecipesForOrder,
    getRecipesForOrderPresenter
);
