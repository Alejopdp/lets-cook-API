import { Locale } from "../../../domain/locale/Locale";
import { IPlanFrequency } from "../../../domain/plan/PlanFrequency/IPlanFrequency";
import { Week } from "../../../domain/week/Week";
import { WeekId } from "../../../domain/week/WeekId";
import { IWeekRepository } from "./IWeekRepository";

const createMockWeeks = (): Week[] => {
    let startDate = new Date("2023-07-17T00:00:00.000+00:00");
    let endDate = new Date("2023-07-23T23:59:00.000+00:00");
    let weeks = [];

    for (let i = 0; i < 500; i++) {
        const week = new Week(new Date(startDate), new Date(endDate), new WeekId());

        weeks.push(week);
        startDate.setDate(startDate.getDate() + 7);
        endDate.setDate(endDate.getDate() + 7);
    }

    return weeks

}
export class MockWeekRepository implements IWeekRepository {
    private _weeks: Week[];

    constructor(weeks?: Week[]) {
        this._weeks = weeks ?? createMockWeeks();
    }
    findPreviousWeek(): Promise<Week | undefined> {
        throw new Error("Method not implemented.");
    }
    findActualWeek(): Promise<Week | undefined> {
        throw new Error("Method not implemented.");
    }
    findLastAndNextEight(): Promise<Week[]> {
        throw new Error("Method not implemented.");
    }
    findWeekTwelveWeeksLater(): Promise<Week | undefined> {
        throw new Error("Method not implemented.");
    }
    findWeekTwelveBiweeksLater(): Promise<Week | undefined> {
        throw new Error("Method not implemented.");
    }
    findWeekTwelveMonthsLater(): Promise<Week | undefined> {
        throw new Error("Method not implemented.");
    }
    public async findNextTwelveByFrequency(frequency: IPlanFrequency, baseDate: Date, dateOfExecution: Date, skipWeek?: boolean): Promise<Week[]> {
        const dateOfExecutionTime = dateOfExecution.getTime();
        var weeksDb: any[] = [];

        if (frequency.isOneTime()) {
            weeksDb = this.weeks.filter(week => week.minDay.getTime() >= dateOfExecutionTime)
                .sort((a, b) => a.minDay.getTime() - b.minDay.getTime()).slice(0, 12);

            return weeksDb
        }

        if (frequency.isWeekly()) {
            weeksDb = this.weeks.filter(week => week.minDay.getTime() >= dateOfExecutionTime)
                .sort((a, b) => a.minDay.getTime() - b.minDay.getTime()).slice(0, 12);

            return weeksDb
        }

        if (frequency.isBiweekly()) {
            const biWeekly = [];
            weeksDb = this.weeks.filter(week => week.minDay.getTime() >= dateOfExecutionTime)
                .sort((a, b) => a.minDay.getTime() - b.minDay.getTime()).slice(0, 26);

            for (let i = 0; i < 26; i++) {
                const addWeek = skipWeek ? i % 2 == 1 : i % 2 == 0;
                if (addWeek) {
                    biWeekly.push(weeksDb[i]);
                }
            }

            return biWeekly
        }

        if (frequency.isMonthly()) {
            const dates = frequency.getNDatesWithFrequencyOffset(12, baseDate)
            const monthlyWeeks: Week[] = [];
            weeksDb = this.weeks.filter(week => week.minDay.getTime() >= dateOfExecutionTime)
                .sort((a, b) => a.minDay.getTime() - b.minDay.getTime()).slice(0, 52);


            for (const week of weeksDb) {
                for (const date of dates) {
                    if (week.containsDate(date)) monthlyWeeks.push(week)
                }
            }

            return monthlyWeeks
        }

        return []
    }
    findNextWeek(): Promise<Week | undefined> {
        throw new Error("Method not implemented.");
    }
    findCurrentWeek(date: Date): Promise<Week> {
        throw new Error("Method not implemented.");
    }

    bulkSave(weeks: Week[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    findBy(conditions: any, locale?: Locale): Promise<Week[]> {
        throw new Error("Method not implemented.");
    }

    findNextTwelve(): Promise<Week[]> {
        throw new Error("Method not implemented.");
    }

    public async save(week: Week): Promise<void> {
        const filtered = this.weeks.filter((w) => !w.id.equals(week.id));
        this.weeks = [...filtered, week];
    }

    public async findAll(): Promise<Week[]> {
        return this.weeks;
    }

    public async findById(weekId: WeekId): Promise<Week | undefined> {
        return this.weeks.find((w) => w.id.equals(weekId));
    }

    public async findAllById(weeksIds: WeekId[]): Promise<Week[]> {
        return this.weeks.filter((week) => weeksIds.some((weekId) => week.id.equals(weekId)));
    }

    /**
     * Getter weeks
     * @return {Week[]}
     */
    public get weeks(): Week[] {
        return this._weeks;
    }

    /**
     * Setter weeks
     * @param {Week[]} value
     */
    public set weeks(value: Week[]) {
        this._weeks = value;
    }
}
