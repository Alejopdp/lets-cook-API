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

    public static getDateHumanLabel(date: Date): string {
        return moment(date).format("dddd Do MMMM");
    }

    public static getHumanWeekRangeLabel(minDay: Date, maxDay: Date): string {
        const month = moment(maxDay).format("MMMM");
        const monthWithCapitalLetter = month.charAt(0).toUpperCase() + month.slice(1);

        return `${moment(minDay).format("DD")} al ${moment(maxDay).format("DD")} de ${monthWithCapitalLetter}`;
    }

    public static getDayOfThisWeekByDayNumber(dayNumber: number): Date {
        var today: Date = new Date();
        // today.setDate(today.getDate() + 5); // Testing days
        const date: Date = new Date(today.getFullYear(), today.getMonth());
        const differenceInDays = dayNumber - today.getDay();

        date.setDate(today.getDate() + differenceInDays);

        return date;
    }
}
