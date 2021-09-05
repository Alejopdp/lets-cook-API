import { logger } from "../../../../../config";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
import { IPlanFrequency } from "../../domain/plan/PlanFrequency/IPlanFrequency";
const moment = require("moment");

moment.locale("es");

export class MomentTimeService {
    constructor() {}

    private static isMonday(day: Date): boolean {
        return moment(day).isoWeekday() === 1;
    }

    public static isWeek(minDay: Date, maxDay: Date): boolean {
        // return this.isTuesday(minDay) && this.isTuesday(maxDay);
        return this.isMonday(minDay);
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

    public static getDdMmYyyy(date: Date): string {
        return moment(date).format("DD/MM/YYYY");
    }

    public static getHumanWeekRangeLabel(minDay: Date, maxDay: Date): string {
        maxDay.setDate(maxDay.getDate() - 1);
        const month = moment(maxDay).format("MMMM");
        const monthWithCapitalLetter = month.charAt(0).toUpperCase() + month.slice(1);

        return `${moment(minDay).format("DD")} al ${moment(maxDay).format("DD")} de ${monthWithCapitalLetter}`;
    }

    public static getShorterHumanWeekRangeLabel(minDay: Date, maxDay: Date): string {
        const maxDayCopy = new Date(maxDay);
        const minDayCopy = new Date(minDay);
        maxDayCopy.setDate(maxDayCopy.getDate() - 1);
        const minMonth: string = moment(minDayCopy).format("MMMM");
        const minMonthWithCapitalLetter = minMonth.charAt(0).toUpperCase() + minMonth.slice(1, 3);
        const maxMonth: string = moment(maxDayCopy).format("MMMM");
        const maxMonthWithCapitalLetter = maxMonth.charAt(0).toUpperCase() + maxMonth.slice(1, 3);

        return `${moment(minDayCopy).format("DD")} ${minMonthWithCapitalLetter} - ${moment(maxDayCopy).format(
            "DD"
        )} ${maxMonthWithCapitalLetter}`;
    }

    public static getDayOfThisWeekByDayNumber(dayNumber: number): Date {
        var today: Date = new Date();
        // today.setDate(today.getDate() + 5); // Testing days
        const date: Date = new Date(today.getFullYear(), today.getMonth());
        const differenceInDays = dayNumber - today.getDay();

        date.setDate(today.getDate() + differenceInDays);

        return date;
    }

    public static getFrequencyOffset(frequency: IPlanFrequency): number {
        if (frequency.isWeekly()) return 7;
        if (frequency.isBiweekly()) return 14;
        if (frequency.isMonthly()) return 28;

        return 7;
    }
}
