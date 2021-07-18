import { logger } from "../../../../../config";
import { IStorageService } from "../../application/storageService/IStorageService";
import { Rate } from "../../domain/rate/Rate";
import { CustomerId } from "../../domain/customer/CustomerId";
import { RecipeId } from "../../domain/recipe/RecipeId";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { CreateRateDto } from "./createRateDto";

export class CreateRate {
    private _rateRepository: IRateRepository;
    private _storageService: IStorageService;

    constructor(rateRepository: IRateRepository, storageService: IStorageService) {
        this._rateRepository = rateRepository;
        this._storageService = storageService;
    }

    public async execute(dto: CreateRateDto): Promise<void> {
        const customerId: CustomerId = new CustomerId(dto.customer);
        const recipeId: RecipeId = new RecipeId(dto.recipe);
        
        const rate: Rate = Rate.create(customerId, recipeId, undefined, undefined);
        
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
