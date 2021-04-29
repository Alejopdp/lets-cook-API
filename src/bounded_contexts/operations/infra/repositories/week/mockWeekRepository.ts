import { Week } from "../../../domain/week/Week";
import { WeekId } from "../../../domain/week/WeekId";
import { IWeekRepository } from "./IWeekRepository";

export class MockWeekRepository implements IWeekRepository {
    private _database: Week[];

    constructor(database: Week[]) {
        this._database = database;
    }

    public async save(week: Week): Promise<void> {
        const filtered = this.database.filter((w) => !w.id.equals(week.id));
        this.database = [...filtered, week];
    }

    public async findAll(): Promise<Week[]> {
        return this.database;
    }

    public async findById(weekId: WeekId): Promise<Week | undefined> {
        return this.database.find((w) => w.id.equals(weekId));
    }

    public async findAllById(weeksIds: WeekId[]): Promise<Week[]> {
        return this.database.filter((week) => weeksIds.some((weekId) => week.id.equals(weekId)));
    }

    /**
     * Getter database
     * @return {Week[]}
     */
    public get database(): Week[] {
        return this._database;
    }

    /**
     * Setter database
     * @param {Week[]} value
     */
    public set database(value: Week[]) {
        this._database = value;
    }
}
