import { ILogRepository } from "./ILogRepository";
import { MongooseLogRepository } from "./mongooseLogRepository";

export const mongooseLogRepository: ILogRepository = new MongooseLogRepository();
