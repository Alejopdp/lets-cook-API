import { ChangeSubscriptionPlanVariant } from "./changeSubscriptionPlanVariant";
import { ChangeSubscriptionPlanVariantController } from "./changeSubscriptionPlanVariantController";

export const changeSubscriptionPlanVariant: ChangeSubscriptionPlanVariant = new ChangeSubscriptionPlanVariant();
export const changeSubscriptionPlanVariantController: ChangeSubscriptionPlanVariantController = new ChangeSubscriptionPlanVariantController(
    changeSubscriptionPlanVariant
);
