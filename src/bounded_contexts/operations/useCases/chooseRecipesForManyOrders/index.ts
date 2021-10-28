import { xlsxService } from "../../application/exportService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { ChooseRecipesForManyOrders } from "./chooseRecipesForManyOrders";
import { ChooseRecipesForManyOrdersController } from "./chooseRecipesForManyOrdersController";

export const chooseRecipesForManyOrders: ChooseRecipesForManyOrders = new ChooseRecipesForManyOrders(
    mongooseOrderRepository,
    mongooseRecipeRepository,
    mongooseSubscriptionRepository
);
export const chooseRecipesForManyOrdersController: ChooseRecipesForManyOrdersController = new ChooseRecipesForManyOrdersController(
    chooseRecipesForManyOrders,
    xlsxService
);
