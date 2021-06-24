import { ISubscriptionRepository } from "./ISubscriptionRepository";
import { MongooseSubscriptionRepository } from "./mongooseSubscriptionRepository";

export const mongooseSubscriptionRepository: ISubscriptionRepository = new MongooseSubscriptionRepository();
