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
    public async findNextTwelveByFrequency(frequency: IPlanFrequency, baseDate: Date, skipWeek?: boolean): Promise<Week[]> {

        // Asume que las semanas ya están ordenadas por fecha de inicio.
        let weeks = await this.findAll();
        let frequencyWeeks = [];

        // Calcula el intervalo de salto basado en la frecuencia.
        let skipInterval = null

        if (frequency.isWeekly()) skipInterval = 1
        if (frequency.isBiweekly()) skipInterval = 2

        if (skipInterval === null) throw new Error("Frecuencia no soportada")

        // Si se pide saltar la semana actual, ajusta la fecha base al inicio de la próxima semana.
        if (skipWeek) {
            baseDate.setDate(baseDate.getDate() + 7);
        }

        // Busca las próximas 12 semanas que coincidan con la frecuencia.
        for (let i = 0; i < weeks.length; i++) {
            let week = weeks[i];

            // Si la fecha de inicio de la semana es posterior a la fecha base, la considera.
            if (week.minDay.getTime() >= baseDate.getTime()) {
                if (frequencyWeeks.length === 0 || i % skipInterval === 0) {
                    frequencyWeeks.push(week);

                    // Si ya hemos encontrado 12 semanas, detiene la búsqueda.
                    if (frequencyWeeks.length === 12) {
                        break;
                    }
                }
            }
        }

        return frequencyWeeks;
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
