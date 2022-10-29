import { IReviewsService, ReviewDto } from "../../application/reviewsService/IReviewsService";
import { GetGoogleReviewsDto } from "./getGoogleReviewsDto";

export class GetGoogleReviews {

    private _reviewsRepository: IReviewsService;

    constructor(reviewsRepository: IReviewsService) {
        this._reviewsRepository = reviewsRepository
    }

    public async execute(dto: GetGoogleReviewsDto): Promise<ReviewDto[]> {
        const reviews = await this.reviewsRepository.getAll(dto.locale)
        const fiveStarReviews = reviews.filter(review => review.stars === 5)

        return this.randomizeReviews(fiveStarReviews)

    }

    private randomizeReviews(reviews: ReviewDto[]): ReviewDto[] {
        const randomReviews = []
        var qtyOfReviews = reviews.length

        while (qtyOfReviews !== 1) {
            const randomIndex = Math.floor(Math.random() * qtyOfReviews)
            const aRandomReview = reviews[randomIndex]

            randomReviews.push(aRandomReview)
            reviews.splice(randomIndex, 1)
            qtyOfReviews--
        }

        return randomReviews
    }

    /**
     * Getter reviewsRepository
     * @return {IReviewsService}
     */
    public get reviewsRepository(): IReviewsService {
        return this._reviewsRepository;
    }
}
