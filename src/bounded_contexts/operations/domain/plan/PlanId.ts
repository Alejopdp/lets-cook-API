import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class PlanId extends UniqueEntityID {
    constructor(id?: number | string) {
        super(id);
    }
}
