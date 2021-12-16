import { mongooseLogRepository } from "../../infra/repositories/log";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseRateRepository } from "../../infra/repositories/rate";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { ChooseRecipesForOrder } from "./chooseRecipesForOrder";
import { ChooseRecipesForOrderController } from "./chooseRecipesForOrderController";

export const chooseRecipesForOrder: ChooseRecipesForOrder = new ChooseRecipesForOrder(
    mongooseOrderRepository,
    mongooseRecipeRepository,
    mongoosePaymentOrderReposiotry,
    mongooseLogRepository,
    mongooseRateRepository
);
export const chooseRecipesForOrderController: ChooseRecipesForOrderController = new ChooseRecipesForOrderController(chooseRecipesForOrder);
