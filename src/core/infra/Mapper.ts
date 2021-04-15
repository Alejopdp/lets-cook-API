export abstract class Mapper<DomainEntityOrValueObject> {
  public abstract toDomain(raw: any): DomainEntityOrValueObject;
  public abstract toPersistence(t: DomainEntityOrValueObject): any;
}
