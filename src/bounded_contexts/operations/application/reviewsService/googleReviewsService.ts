import axios from "axios";
import { Locale } from "../../domain/locale/Locale";
import { IReviewsService, ReviewDto } from "./IReviewsService";
import { Auth } from "googleapis"

type GoogleStarRating = "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "STAR_RATING_UNSPECIFIED"

type GoogleReview = {
    reviewId: string
    reviewer: {
        profilePhotoUrl: string
        displayName: string
    },
    starRating: GoogleStarRating
    createTime: string;
    updateTime: string;
    name: string;
    comment?: string
}

const STAR_RATING_MAP: Map<GoogleStarRating, number> = new Map([["ONE", 1], ["TWO", 2], ["THREE", 3], ["FOUR", 4], ["FIVE", 5], ["STAR_RATING_UNSPECIFIED", 0]])

export class GoogleReviewsService implements IReviewsService {
    public async getAll(locale: Locale): Promise<ReviewDto[]> {

        try {
            const accessToken = await this.getAccessToken()
            const res = await axios.get(`https://mybusiness.googleapis.com/v4/accounts/104947658459106658401/locations/5728607255678643306/reviews`, { headers: { "Authorization": `Bearer ${accessToken}` } })

            if (res.status === 200) return this.getMappedReviews(res.data.reviews)

            return []
        } catch (error) {
            console.log("Error while trying to get all the reviews")
            console.error(error)
            return []
        }
    }

    private async getAccessToken(): Promise<string> {
        const auth = new Auth.GoogleAuth({ keyFile: `${__dirname}/../../../../../letscook-001-020bf42f3fa6.json`, scopes: ["https://www.googleapis.com/auth/business.manage"] })
        const token = await auth.getAccessToken()

        return token ?? ""
    }

    private getMappedReviews(googleReviews: GoogleReview[]): ReviewDto[] {
        const reviews: ReviewDto[] = []

        // Reviews are iterated from newest to oldest
        for (let review of googleReviews) {
            if (review.starRating === "STAR_RATING_UNSPECIFIED" || !review.comment) continue

            const goodReview: ReviewDto = {
                id: review.reviewId,
                avatar: review.reviewer.profilePhotoUrl,
                text: review.comment,
                name: review.reviewer.displayName,
                stars: STAR_RATING_MAP.get(review.starRating) ?? 0,
                date: new Date(review.createTime)

            }
            reviews.push(goodReview)
        }

        return reviews
    }

}