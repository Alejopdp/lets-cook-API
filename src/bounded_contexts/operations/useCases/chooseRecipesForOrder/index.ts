import { mongooseLogRepository } from "../../infra/repositories/log";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { ChooseRecipesForOrder } from "./chooseRecipesForOrder";
import { ChooseRecipesForOrderController } from "./chooseRecipesForOrderController";

export const chooseRecipesForOrder: ChooseRecipesForOrder = new ChooseRecipesForOrder(
    mongooseOrderRepository,
    mongooseRecipeRepository,
    mongoosePaymentOrderReposiotry,
    mongooseLogRepository
);
export const chooseRecipesForOrderController: ChooseRecipesForOrderController = new ChooseRecipesForOrderController(chooseRecipesForOrder);
