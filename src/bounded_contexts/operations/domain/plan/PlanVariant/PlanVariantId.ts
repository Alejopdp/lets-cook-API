import { UniqueEntityID } from "../../../../../core/domain/UniqueEntityID";

export class PlanVariantId extends UniqueEntityID {
    constructor(id?: number | string) {
        super(id);
    }
}
