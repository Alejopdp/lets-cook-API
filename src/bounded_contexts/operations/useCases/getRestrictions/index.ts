import { mongooseRecipeVariantRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction";
import { GetRestrictions } from "./getRestrictions";
import { GetRestrictionsController } from "./getRestrictionsController";
import { GetRestrictionsPresenter } from "./getRestrictionsPresenter";

export const getRestrictions: GetRestrictions = new GetRestrictions(mongooseRecipeVariantRestrictionRepository);
export const getRestrictionsPresenter: GetRestrictionsPresenter = new GetRestrictionsPresenter();
export const getRestrictionsController: GetRestrictionsController = new GetRestrictionsController(
    getRestrictions,
    getRestrictionsPresenter
);
