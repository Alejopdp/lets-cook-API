import { Day } from "../../day/Day";

export class DateOfCharge {
    private _day: Day;
    private _hour: string;
    private _minute: string;

    constructor(day: Day, hour: string, minute: string) {
        this._day = day;
        this._hour = hour;
        this._minute = minute;
    }

    public matches(day: Day): boolean {
        return this.day.equals(day);
    }


    /**
     * Getter day
     * @return {Day}
     */
    public get day(): Day {
        return this._day;
    }

    /**
     * Getter hour
     * @return {string}
     */
    public get hour(): string {
        return this._hour;
    }

    /**
     * Getter minute
     * @return {string}
     */
    public get minute(): string {
        return this._minute;
    }

    /**
     * Setter day
     * @param {Day} value
     */
    public set day(value: Day) {
        this._day = value;
    }

    /**
     * Setter hour
     * @param {string} value
     */
    public set hour(value: string) {
        this._hour = value;
    }

    /**
     * Setter minute
     * @param {string} value
     */
    public set minute(value: string) {
        this._minute = value;
    }

}