import { InMemoryCustomerRepository } from "./inMemoryCustomerRepository";
import { MongooseCustomerRepository } from "./mongooseCustomerRepository";

export const mongooseCustomerRepository: MongooseCustomerRepository = new MongooseCustomerRepository();
export const inMemoryCustomerRepository: InMemoryCustomerRepository = new InMemoryCustomerRepository();