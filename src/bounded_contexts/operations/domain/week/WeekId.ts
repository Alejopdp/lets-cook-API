import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class WeekId extends UniqueEntityID {
    constructor(id?: string | number) {
        super(id);
    }
}
