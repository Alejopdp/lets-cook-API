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
        return await this.findBy({ _id: weeksIds.map((id) => id.value) });
    }

    public async findBy(conditions: any, locale?: Locale): Promise<Week[]> {
        const weeksDb = await WeekModel.find({ ...conditions, deletionFlag: false });

        return weeksDb.map((raw: any) => weekMapper.toDomain(raw, locale));
    }

    public async findNextEight(): Promise<Week[]> {
        const weeksDb = await WeekModel.find({}).limit(8);

        return weeksDb.map((week: any) => weekMapper.toDomain(week));
    }
}
