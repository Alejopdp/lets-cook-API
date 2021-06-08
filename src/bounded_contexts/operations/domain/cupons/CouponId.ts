import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

export class CouponId extends UniqueEntityID {
    constructor(id?: string | number) {
        super(id);
    }
}
