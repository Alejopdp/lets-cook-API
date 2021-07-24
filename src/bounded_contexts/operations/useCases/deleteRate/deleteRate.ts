import { RateId } from "../../domain/rate/RateId";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { DeleteRateDto } from "./deleteRateDto";

export class DeleteRate {
    private _rateRepository: IRateRepository;

    constructor(rateRepository: IRateRepository) {
        this._rateRepository = rateRepository;
    }

    public async execute(dto: DeleteRateDto): Promise<void> {
        const rateId: RateId = new RateId(dto.rateId);
        
        await this.rateRepository.delete(rateId);
    }

    /**
     * Getter rateRepository
     * @return {IRateRepository}
     */
    public get rateRepository(): IRateRepository {
        return this._rateRepository;
    }
}
