import { Week } from "../../../domain/week/Week";
import { WeekId } from "../../../domain/week/WeekId";

export interface IWeekRepository {
    save(week: Week): Promise<void>;
    findAll(): Promise<Week[]>;
    findById(weekId: WeekId): Promise<Week | undefined>;
    findAllById(weeksIds: WeekId[]): Promise<Week[]>;
}
