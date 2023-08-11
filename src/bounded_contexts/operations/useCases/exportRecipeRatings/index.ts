import { xlsxService } from "../../application/exportService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseRateRepository } from "../../infra/repositories/rate";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { ExportRecipeRatings } from "./exportRecipeRatings";
import { ExportRecipeRatingsController } from "./exportRecipeRatingsController";

export const exportRecipeRatings = new ExportRecipeRatings(mongooseRateRepository, mongooseCustomerRepository, mongooseOrderRepository, mongooseSubscriptionRepository, xlsxService)
export const exportRecipeRatingsController = new ExportRecipeRatingsController(exportRecipeRatings)