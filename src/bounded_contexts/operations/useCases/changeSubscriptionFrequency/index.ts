import { ChangeSubscriptionFrequency } from "./changeSubscriptionFrequency";
import { ChangeSubscriptionFrequencyController } from "./changeSubscriptionFrequencyController";

export const changeSubscriptionFrequency: ChangeSubscriptionFrequency = new ChangeSubscriptionFrequency();
export const changeSubscriptionFrequencyController: ChangeSubscriptionFrequencyController = new ChangeSubscriptionFrequencyController(
    changeSubscriptionFrequency
);
