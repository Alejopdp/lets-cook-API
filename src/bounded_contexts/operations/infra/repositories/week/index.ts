import { Week } from "../../../domain/week/Week";
import { WeekId } from "../../../domain/week/WeekId";
import { IWeekRepository } from "./IWeekRepository";
import { MockWeekRepository } from "./mockWeekRepository";
import { MongooseWeekRepository } from "./mongooseWeekRepository";

var database: Week[] = [];

export const mockWeekRepository: IWeekRepository = new MockWeekRepository(database);
export const mongooseWeekRepository: IWeekRepository = new MongooseWeekRepository();
