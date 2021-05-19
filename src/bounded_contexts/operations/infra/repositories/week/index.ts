import { Week } from "../../../domain/week/Week";
import { WeekId } from "../../../domain/week/WeekId";
import { IWeekRepository } from "./IWeekRepository";
import { MockWeekRepository } from "./mockWeekRepository";

var database: Week[] = [];

// export var week1 = Week.create(new Date(2021, 4, 4), new Date(2021, 4, 10), new WeekId(1));
// export var week2 = Week.create(new Date(2021, 4, 11), new Date(2021, 4, 17), new WeekId(2));
export var week1 = Week.create(new Date(2021, 4, 18), new Date(2021, 4, 24), new WeekId(1));
export var week2 = Week.create(new Date(2021, 4, 25), new Date(2021, 4, 31), new WeekId(2));
export var week3 = Week.create(new Date(2021, 5, 1), new Date(2021, 5, 7), new WeekId(3));
export var week4 = Week.create(new Date(2021, 5, 8), new Date(2021, 5, 14), new WeekId(4));
export var week5 = Week.create(new Date(2021, 5, 15), new Date(2021, 5, 21), new WeekId(5));
export var week6 = Week.create(new Date(2021, 5, 22), new Date(2021, 5, 28), new WeekId(6));
export var week7 = Week.create(new Date(2021, 5, 29), new Date(2021, 6, 5), new WeekId(7));
export var week8 = Week.create(new Date(2021, 6, 6), new Date(2021, 6, 12), new WeekId(8));

database = [week1, week2, week3, week4, week5, week6, week7, week8];
export const mockWeekRepository: IWeekRepository = new MockWeekRepository(database);
