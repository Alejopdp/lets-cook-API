import { Week } from "../../../domain/week/Week";
import { Week as WeekModel } from "../../../../../infraestructure/mongoose/models";
import { WeekId } from "../../../domain/week/WeekId";
import { IWeekRepository } from "./IWeekRepository";
import { weekMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";
import { PlanFrequency } from "../../../domain/plan/PlanFrequency";

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
        const weeksDb = await WeekModel.find({ ...conditions, deletionFlag: false }).sort(["minDate", "asc"]);

        return weeksDb.map((raw: any) => weekMapper.toDomain(raw, locale));
    }

    public async findNextTwelve(skipOneWeek: boolean): Promise<Week[]> {
        const today = new Date();

        if (skipOneWeek) today.setDate(today.getDate() + 7);
        const weeksDb = await WeekModel.find({ minDay: { $gte: today } })
            .sort({ minDay: 1 })
            .limit(12);

        return weeksDb.map((week: any) => weekMapper.toDomain(week));
    }

    public async findNextTwelveByFrequency(frequency: PlanFrequency): Promise<Week[]> {
        const today = new Date();
        const toadyIso = today.toISOString();
        var weeksDb: any[] = [];

        if (frequency === PlanFrequency.Semanal) {
            weeksDb = await WeekModel.find({ minDay: { $gte: toadyIso } })
                .sort({ minDay: 1 })
                .limit(12);
        }

        if (frequency === PlanFrequency.Quincenal) {
            const biWeekly = [];
            weeksDb = await WeekModel.find({ minDay: { $gte: toadyIso } })
                .sort({ minDay: 1 })
                .limit(24);

            for (let i = 1; i++; i <= 24) {
                if (i % 2 == 1) {
                    biWeekly.push(weeksDb[i]);
                }
            }

            weeksDb = [...biWeekly];
        }

        if (frequency === PlanFrequency.Mensual) {
            const monthly = [];
            weeksDb = await WeekModel.find({ minDay: { $gte: toadyIso } })
                .sort({ minDay: 1 })
                .limit(48);

            for (let i = 1; i++; i <= 48) {
                if (i % 4 == 1 || i === 1) {
                    monthly.push(weeksDb[i]);
                }
            }

            weeksDb = [...monthly];
        }

        return weeksDb.map((week: any) => weekMapper.toDomain(week));
    }

    public async findCurrentWeek(date: Date): Promise<Week | undefined> {
        const weekDb = await WeekModel.findOne({ minDay: { $lte: date.toISOString() }, maxDay: { $gte: date.toISOString() } });

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
}
