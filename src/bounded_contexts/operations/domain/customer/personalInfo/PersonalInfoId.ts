import { UniqueEntityID } from "../../../../../core/domain/UniqueEntityID";

export class PersonalInfoId extends UniqueEntityID {
    constructor(id?: string | number) {
        super(id);
    }
}
