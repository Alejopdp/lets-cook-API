import { xlsxService } from "../../application/exportService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongoosePaymentOrderReposiotry } from "../../infra/repositories/paymentOrder";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { ChooseRecipesForManyOrders } from "./chooseRecipesForManyOrders";
import { ChooseRecipesForManyOrdersController } from "./chooseRecipesForManyOrdersController";

export const chooseRecipesForManyOrders: ChooseRecipesForManyOrders = new ChooseRecipesForManyOrders(
    mongooseOrderRepository,
    mongooseRecipeRepository,
    mongooseSubscriptionRepository,
    mongoosePaymentOrderReposiotry
);
export const chooseRecipesForManyOrdersController: ChooseRecipesForManyOrdersController = new ChooseRecipesForManyOrdersController(
    chooseRecipesForManyOrders,
    xlsxService
);
