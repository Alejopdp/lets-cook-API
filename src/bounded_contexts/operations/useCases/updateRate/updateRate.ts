import { IStorageService } from "../../application/storageService/IStorageService";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { UpdateRateDto } from "./updateRateDto";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";
import { RecipeRatingId } from "../../domain/recipeRating/RecipeRatingId";
import { Locale } from "../../domain/locale/Locale";

export class UpdateRate {
    private _rateRepository: IRateRepository;
    private _storageService: IStorageService;

    constructor(rateRepository: IRateRepository, storageService: IStorageService) {
        this._rateRepository = rateRepository;
        this._storageService = storageService;
    }

    public async execute(dto: UpdateRateDto): Promise<void> {
        if (dto.rateValue > 5) throw new Error("La calificación no puede ser mayor a 5");

        const rateId: RecipeRatingId = new RecipeRatingId(dto.rateId);
        const rating: RecipeRating | undefined = await this.rateRepository.findById(rateId, Locale.es);

        if (!!!rating) throw new Error("No se encontró la receta para valorarla");

        rating.updateRating(dto.rateValue, dto.commentRate, dto.ratingDate);

        await this.rateRepository.save(rating);
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
