import { logger } from "../../../../../config";
const moment = require("moment");

moment.locale("es");

export class MomentTimeService {
    constructor() {}

    private static isTuesday(day: Date): boolean {
        return moment(day).isoWeekday() === 2;
    }

    public static isWeek(minDay: Date, maxDay: Date): boolean {
        // return this.isTuesday(minDay) && this.isTuesday(maxDay);
        return this.isTuesday(minDay);
    }

    public static getNumberOfDayInMonth(date: Date): string {
        return moment(date).format("DD");
    }

    public static getShortenedMonthName(date: Date): string {
        return moment(date).format("MMM");
    }
}
