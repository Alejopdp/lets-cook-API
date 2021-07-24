import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { ChooseRecipesForOrder } from "./chooseRecipesForOrder";
import { ChooseRecipesForOrderController } from "./chooseRecipesForOrderController";

export const chooseRecipesForOrder: ChooseRecipesForOrder = new ChooseRecipesForOrder(mongooseOrderRepository, mongooseRecipeRepository);
export const chooseRecipesForOrderController: ChooseRecipesForOrderController = new ChooseRecipesForOrderController(chooseRecipesForOrder);
