import { Week } from "../../../domain/week/Week";
import { Week as WeekModel } from "../../../../../infraestructure/mongoose/models";
import { WeekId } from "../../../domain/week/WeekId";
import { IWeekRepository } from "./IWeekRepository";
import { weekMapper } from "../../../mappers";
import { Locale } from "../../../domain/locale/Locale";

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

        await WeekModel.create(weeksToSave);
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
}
