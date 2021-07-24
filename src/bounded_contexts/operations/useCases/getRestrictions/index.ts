import { RecipeVariantRestriction } from "../../../../infraestructure/mongoose/models";
import { s3Service } from "../../application/storageService";
import { mongooseOrderRepository } from "../../infra/repositories/order";
import { mongooseRecipeVariantRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetRestrictions } from "./getRestrictions";
import { GetRestrictionsController } from "./getRestrictionsController";
import { GetRestrictionsPresenter } from "./getRestrictionsPresenter";

export const getRestrictions: GetRestrictions = new GetRestrictions(mongooseRecipeVariantRestrictionRepository);
export const getRestrictionsPresenter: GetRestrictionsPresenter = new GetRestrictionsPresenter();
export const getRestrictionsController: GetRestrictionsController = new GetRestrictionsController(
    getRestrictions,
    getRestrictionsPresenter
);
