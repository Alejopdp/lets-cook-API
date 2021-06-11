import { Mapper } from "../../../core/infra/Mapper";
import { Locale } from "../domain/locale/Locale";
import { Week } from "../domain/week/Week";
import { WeekId } from "../domain/week/WeekId";

export class WeekMapper implements Mapper<Week> {
    public toDomain(raw: any, locale?: Locale): Week {
        return new Week(raw.minDay, raw.maxDay, new WeekId(raw.id));
    }

    public toPersistence(t: Week, locale?: Locale) {
        return {
            _id: t.id.value,
            minDay: t.minDay,
            maxDay: t.maxDay,
        };
    }
}
