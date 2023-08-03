import { InMemoryRateRepository } from "./inMemoryRateRepository";
import { MongooseRateRepository } from "./mongooseRateRepository";

export const mongooseRateRepository: MongooseRateRepository = new MongooseRateRepository();
export const inMemoryRateRepository: InMemoryRateRepository = new InMemoryRateRepository([]);