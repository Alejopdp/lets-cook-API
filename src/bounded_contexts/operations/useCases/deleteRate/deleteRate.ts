import { Locale } from "../../domain/locale/Locale";
import { RateId } from "../../domain/rate/RateId";
import { RecipeRating } from "../../domain/recipeRating/RecipeRating";
import { IRateRepository } from "../../infra/repositories/rate/IRateRepository";
import { DeleteRateDto } from "./deleteRateDto";

export class DeleteRate {
    private _rateRepository: IRateRepository;

    constructor(rateRepository: IRateRepository) {
        this._rateRepository = rateRepository;
    }

    public async execute(dto: DeleteRateDto): Promise<void> {
        const rateId: RateId = new RateId(dto.rateId);
        const recipeRating: RecipeRating | undefined = await this.rateRepository.findById(rateId, Locale.es);

        if (!recipeRating) throw new Error("Rate not found");

        recipeRating.rateLater();
        await this.rateRepository.save(recipeRating);
    }

    /**
     * Getter rateRepository
     * @return {IRateRepository}
     */
    public get rateRepository(): IRateRepository {
        return this._rateRepository;
    }
}
