import { IValueObject } from "../../../../core/domain/ValueObject";

export class PlanSlug implements IValueObject<PlanSlug> {
    private _slug: string;

    constructor(slug: string) {
        this._slug = slug.replace(" ", "-").toLowerCase();
    }

    public equals(valueObject: PlanSlug): boolean {
        return this.slug === valueObject.slug;
    }

    /**
     * Getter slug
     * @return {string}
     */
    public get slug(): string {
        return this._slug;
    }
}
