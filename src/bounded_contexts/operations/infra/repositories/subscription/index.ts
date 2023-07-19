import { ISubscriptionRepository } from "./ISubscriptionRepository";
import { InMemorySusbcriptionRepository } from "./inMemorySubscriptionRepository";
import { MongooseSubscriptionRepository } from "./mongooseSubscriptionRepository";

export const mongooseSubscriptionRepository: ISubscriptionRepository = new MongooseSubscriptionRepository();
export const inMemorySusbcriptionRepository: ISubscriptionRepository = new InMemorySusbcriptionRepository([]);
