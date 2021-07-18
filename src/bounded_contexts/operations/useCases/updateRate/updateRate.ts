import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Rate } from "../../domain/rate/Rate";
import { RateId } from "../../domain/rate/RateId";
import { CustomerId } from "../../domain/customer/CustomerId";
import { RecipeId } from "../../domain/recipe/RecipeId";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { UpdateRateDto } from "./updateRateDto";

export class UpdateRate {
    private _rateRepository: IRateRepository;
    private _storageService: IStorageService;

    constructor(rateRepository: IRateRepository, storageService: IStorageService) {
        this._rateRepository = rateRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateRateDto): Promise<void> {
        if(dto.rateValue > 5) throw new Error("La calificación no puede ser mayor a 5");

        const rateId: RateId = new RateId(dto.rateId);
        const rate: Rate | undefined = await this.rateRepository.findById(rateId);

        rate?.addRate(dto.rateValue, dto.commentRate);
        
        await this.rateRepository.save(rate);
    }

    /**
     * Getter rateRepository
     * @return {IRateRepository}
     */
    public get rateRepository(): IRateRepository {
        return this._rateRepository;
    }

    /**
     * Getter storageService
     * @return {IStorageService}
     */
    public get storageService(): IStorageService {
        return this._storageService;
    }
}
