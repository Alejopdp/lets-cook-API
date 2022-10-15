import { IReviewsService, ReviewDto } from "../../application/reviewsService/IReviewsService";
import { GetGoogleReviewsDto } from "./getGoogleReviewsDto";

export class GetGoogleReviews {

    private _reviewsRepository: IReviewsService;

    constructor(reviewsRepository: IReviewsService) {
        this._reviewsRepository = reviewsRepository
    }

    public async execute(dto: GetGoogleReviewsDto): Promise<ReviewDto[]> {
        return await this.reviewsRepository.getAll(dto.locale)

    }

    /**
     * Getter reviewsRepository
     * @return {IReviewsService}
     */
    public get reviewsRepository(): IReviewsService {
        return this._reviewsRepository;
    }
}
