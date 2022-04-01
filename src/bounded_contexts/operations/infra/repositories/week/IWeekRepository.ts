import { Locale } from "../../../domain/locale/Locale";
import { IPlanFrequency } from "../../../domain/plan/PlanFrequency/IPlanFrequency";
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
    findNextTwelveByFrequency(frequency: IPlanFrequency, skipWeek?: boolean): Promise<Week[]>;
    findCurrentWeek(date: Date): Promise<Week | undefined>;
    findActualWeek(): Promise<Week | undefined>;
    findNextWeek(): Promise<Week | undefined>;
    findLastAndNextEight(): Promise<Week[]>;
    findWeekTwelveWeeksLater(): Promise<Week | undefined>;
    findWeekTwelveBiweeksLater(): Promise<Week | undefined>;
    findWeekTwelveMonthsLater(): Promise<Week | undefined>;
    // findWeeksForTwoYearsFromNow(): Promise<Week[]>
}
