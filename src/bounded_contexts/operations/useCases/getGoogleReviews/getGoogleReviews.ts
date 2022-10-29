import { IReviewsService, ReviewDto } from "../../application/reviewsService/IReviewsService";
import { MomentTimeService } from "../../application/timeService/momentTimeService";
import { GetGoogleReviewsDto } from "./getGoogleReviewsDto";

export class GetGoogleReviews {

    private _reviewsRepository: IReviewsService;

    constructor(reviewsRepository: IReviewsService) {
        this._reviewsRepository = reviewsRepository
    }

    public async execute(dto: GetGoogleReviewsDto): Promise<ReviewDto[]> {
        const reviews = await this.reviewsRepository.getAll(dto.locale)
        const fiveStarReviews = reviews.filter(review => review.stars === 5 && review.id !== "AbFvOql2Vp2lxOMWKU0UsiGTxu_P0dkIFNqclU5RtheK0tQLK2TVh4Zka0h0hAvWZdj9qXmsdHW5Cg") // Too much text, breaks front end

        //@ts-ignore
        return this.randomizeReviews(fiveStarReviews).map(review => ({ ...review, date: MomentTimeService.getDdMmYyyy(review.date, dto.locale) }))

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
