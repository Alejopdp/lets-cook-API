import { awsSesV3Service } from "../../../../shared/notificationService";
import { mongooseLogRepository } from "../../infra/repositories/log";
import { mongooseRecipeVariantRestrictionRepository } from "../../infra/repositories/recipeVariantRestriction";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { UpdateSubscriptionRestriction } from "./updateSubscriptionRestriction";
import { UpdateSubscriptionRestrictionController } from "./updateSubscriptionRestrictionController";

export const updateSubscriptionRestriction: UpdateSubscriptionRestriction = new UpdateSubscriptionRestriction(
    mongooseSubscriptionRepository,
    mongooseRecipeVariantRestrictionRepository,
    awsSesV3Service,
    mongooseLogRepository
);
export const updateSubscriptionRestrictionController: UpdateSubscriptionRestrictionController = new UpdateSubscriptionRestrictionController(
    updateSubscriptionRestriction
);
