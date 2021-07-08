import { Locale } from "../../../domain/locale/Locale";
import { PlanFrequency } from "../../../domain/plan/PlanFrequency";
import { Week } from "../../../domain/week/Week";
import { WeekId } from "../../../domain/week/WeekId";

export interface IWeekRepository {
    save(week: Week): Promise<void>;
    bulkSave(weeks: Week[]): Promise<void>;
    findAll(): Promise<Week[]>;
    findById(weekId: WeekId): Promise<Week | undefined>;
    findAllById(weeksIds: WeekId[]): Promise<Week[]>;
    findBy(conditions: any, locale?: Locale): Promise<Week[]>;
    findNextTwelve(skipOneWeek: boolean): Promise<Week[]>;
    findNextTwelveByFrequency(frequency: PlanFrequency): Promise<Week[]>;
    findCurrentWeek(date: Date): Promise<Week | undefined>;
    findNextWeek(): Promise<Week | undefined>;
}
