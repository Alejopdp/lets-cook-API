import { Rate } from "../../../domain/rate/Rate";
import { RateId } from "../../../domain/rate/RateId";

export interface IRateRepository {
    save(rate: Rate | undefined): Promise<void>;
    findById(rateId: RateId): Promise<Rate | undefined>;
    findAll(): Promise<Rate[]>;
    delete(rateId: RateId): void;
}
