import { logger } from "../../../../../config";
import { PlanFrequency } from "../../domain/plan/PlanFrequency";
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

    public static getFrequencyOffset(frequency: PlanFrequency): number {
        if (frequency === PlanFrequency.Semanal) return 7;
        if (frequency === PlanFrequency.Quincenal) return 14;
        if (frequency === PlanFrequency.Mensual) return 28;

        return 7;
    }
}
