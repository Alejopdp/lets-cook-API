import { Locale } from "../../bounded_contexts/operations/domain/locale/Locale";

export abstract class Mapper<DomainEntityOrValueObject, DatabaseModel> {
    public abstract toDomain(raw: any, locale?: Locale): DomainEntityOrValueObject;
    public abstract toPersistence(t: DomainEntityOrValueObject, locale?: Locale): DatabaseModel;
}
