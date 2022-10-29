import { Week } from "../../../domain/week/Week";
import { Week as WeekModel } from "../../../../../infraestructure/mongoose/models";
import { WeekId } from "../../../domain/week/WeekId";
import { IWeekRepository } from "./IWeekRepository";
import { weekMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";
import { PlanFrequency } from "../../../domain/plan/PlanFrequency";
import { IPlanFrequency } from "../../../domain/plan/PlanFrequency/IPlanFrequency";

export class MongooseWeekRepository implements IWeekRepository {
    public async save(week: Week): Promise<void> {
        const weekToSave = weekMapper.toPersistence(week);

        if (await WeekModel.exists({ _id: week.id.value })) {
            await WeekModel.updateOne({ _id: week.id.value }, weekToSave);
        } else {
            await WeekModel.create(weekToSave);
        }
    }

    public async bulkSave(weeks: Week[]): Promise<void> {
        const weeksToSave = weeks.map((week) => weekMapper.toPersistence(week));

        await WeekModel.insertMany(weeksToSave);
    }

    public async findAll(): Promise<Week[]> {
        return await this.findBy({});
    }

    public async findById(weekId: WeekId): Promise<Week | undefined> {
        const weekDb = await WeekModel.findById(weekId.value, { deletionFlag: false });

        return weekDb ? weekMapper.toDomain(weekDb) : undefined;
    }

    public async findAllById(weeksIds: WeekId[]): Promise<Week[]> {
        return await this.findBy({ _id: { $in: weeksIds.map((id) => id.value) } });
    }

    public async findBy(conditions: any, locale?: Locale): Promise<Week[]> {
        const weeksDb = await WeekModel.find({ ...conditions, deletionFlag: false }).sort({ minDate: "asc" });

        return weeksDb.map((raw: any) => weekMapper.toDomain(raw, locale));
    }

    public async findNextTwelve(skipOneWeek: boolean): Promise<Week[]> {
        const today = new Date();

        if (skipOneWeek) today.setDate(today.getDate() + 7);
        const weeksDb = await WeekModel.find({ maxDay: { $gte: today } })
            .sort({ maxDay: 1 })
            .limit(12);

        return weeksDb.map((week: any) => weekMapper.toDomain(week));
    }

    public async findNextTwelveByFrequency(frequency: IPlanFrequency, baseDate: Date, skipWeek?: boolean): Promise<Week[]> {
        const today = new Date();
        const todayIso = today.toISOString();
        var weeksDb: any[] = [];

        if (frequency.isOneTime()) {
            weeksDb = await WeekModel.find({ minDay: { $gte: todayIso } })
                .sort({ minDay: 1 })
                .limit(13);

            return weeksDb.map(week => weekMapper.toDomain(week))
        }

        if (frequency.isWeekly()) {
            weeksDb = await WeekModel.find({ minDay: { $gte: todayIso } })
                .sort({ minDay: 1 })
                .limit(13);

            return weeksDb.map(week => weekMapper.toDomain(week))
        }

        if (frequency.isBiweekly()) {
            const biWeekly = [];
            weeksDb = await WeekModel.find({ minDay: { $gte: todayIso } })
                .sort({ minDay: 1 })
                .limit(26);

            for (let i = 0; i < 26; i++) {
                const addWeek = skipWeek ? i % 2 == 1 : i % 2 == 0;
                if (addWeek) {
                    biWeekly.push(weeksDb[i]);
                }
            }

            return biWeekly.map(week => weekMapper.toDomain(week))
        }

        if (frequency.isMonthly()) {
            const dates = frequency.getNDatesWithFrequencyOffset(12, baseDate)
            const monthlyWeeks: Week[] = [];
            weeksDb = await WeekModel.find({ minDay: { $gte: todayIso } })
                .sort({ minDay: 1 })
                .limit(52);

            const domainWeeks = weeksDb.map(week => weekMapper.toDomain(week))

            for (const week of domainWeeks) {
                for (const date of dates) {
                    if (week.containsDate(date)) monthlyWeeks.push(week)
                }
            }

            return monthlyWeeks
        }

        return []

    }

    public async findPreviousWeek(): Promise<Week | undefined> {
        const today = new Date();
        const lastWeekDate = new Date(today.setDate(today.getDate() - 7));

        const weekDb = await WeekModel.findOne({ $and: [{ minDay: { $lte: lastWeekDate } }, { maxDay: { $gte: lastWeekDate } }] });

        return weekDb ? weekMapper.toDomain(weekDb) : undefined;
    }
    public async findCurrentWeek(date: Date): Promise<Week | undefined> {
        const weekDb = await WeekModel.findOne({ $and: [{ minDay: { $lte: date } }, { maxDay: { $gte: date } }] });

        return weekDb ? weekMapper.toDomain(weekDb) : undefined;
    }

    public async findActualWeek(): Promise<Week | undefined> {
        const today = new Date();

        const weekDb = await WeekModel.findOne({
            minDay: { $lte: today.toISOString() },
            maxDay: { $gte: today.toISOString() },
        });

        return weekDb ? weekMapper.toDomain(weekDb) : undefined;
    }

    public async findNextWeek(): Promise<Week | undefined> {
        const todayNextWeek = new Date();
        todayNextWeek.setDate(todayNextWeek.getDate() + 7);

        const weekDb = await WeekModel.findOne({
            minDay: { $lte: todayNextWeek.toISOString() },
            maxDay: { $gte: todayNextWeek.toISOString() },
        });

        return weekDb ? weekMapper.toDomain(weekDb) : undefined;
    }

    public async findWeekTwelveWeeksLater(): Promise<Week | undefined> {
        const dayInTwelveWeeks = new Date();
        dayInTwelveWeeks.setDate(dayInTwelveWeeks.getDate() + 7 * 12);

        const weekDb = await WeekModel.findOne({ minDay: { $lte: dayInTwelveWeeks }, maxDay: { $gte: dayInTwelveWeeks } });

        return weekDb ? weekMapper.toDomain(weekDb) : undefined;
    }

    public async findWeekTwelveBiweeksLater(): Promise<Week | undefined> {
        const dayInTwelveWeeks = new Date();
        dayInTwelveWeeks.setDate(dayInTwelveWeeks.getDate() + 14 * 12 + 2); // + 2 cause if not it will get one week previous to shipping date


        const weekDb = await WeekModel.findOne({ minDay: { $lte: dayInTwelveWeeks }, maxDay: { $gte: dayInTwelveWeeks } });

        return weekDb ? weekMapper.toDomain(weekDb) : undefined;
    }

    public async findWeekTwelveMonthsLater(): Promise<Week | undefined> {
        const dayInTwelveWeeks = new Date();
        dayInTwelveWeeks.setDate(dayInTwelveWeeks.getDate() + 28 * 12 + 2); // + 2 cause if not it will get one week previous to shipping date

        const weekDb = await WeekModel.findOne({ minDay: { $lte: dayInTwelveWeeks }, maxDay: { $gte: dayInTwelveWeeks } });

        return weekDb ? weekMapper.toDomain(weekDb) : undefined;
    }

    public async findLastAndNextEight(): Promise<Week[]> {
        const minDay = new Date();
        const maxDay = new Date();

        minDay.setDate(minDay.getDate() - 7 * 8);
        maxDay.setDate(maxDay.getDate() + 7 * 8);

        return await this.findBy({ minDay: { $gte: minDay }, maxDay: { $lte: maxDay } });
    }
}
