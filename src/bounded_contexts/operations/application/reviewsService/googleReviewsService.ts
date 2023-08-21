import axios from "axios";
import { Locale } from "../../domain/locale/Locale";
import { IReviewsService, ReviewDto } from "./IReviewsService";
import { google } from "googleapis"
import client_secret from "../../../../../client_secret_859787193343-oqoqiqefal2s6vkc2sga1lhjgaskh855.apps.googleusercontent.com (1).json"
import { access } from "fs";

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
            let reviews: ReviewDto[] = []
            const accessToken = await this.getAccessToken()
            const reviewRes = await axios.get(`https://mybusiness.googleapis.com/v4/accounts/104947658459106658401/locations/5728607255678643306/reviews`, { headers: { "Authorization": `Bearer ${accessToken}` } })
            if (reviewRes.status === 200) reviews = this.getMappedReviews(reviewRes.data.reviews)


            return reviews
        } catch (error) {
            console.log("Error while trying to get all the reviews")
            console.error(error)
            return []
        }
    }

    private async getAccessToken(): Promise<string> {
        const oauth2Client = new google.auth.OAuth2({ clientId: "859787193343-oqoqiqefal2s6vkc2sga1lhjgaskh855.apps.googleusercontent.com", clientSecret: "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", redirectUri: process.env.CUSTOMER_ORIGIN_URL })
        const refresh_token = "1//03ewfMsUOuIqVCgYIARAAGAMSNwF-L9IrWNvasWUzA85NlJhsbYOyUqL_NriBfthz_XR_oCt3_ZA3ggpLizr2CivOPIJ_a_7TRzQ" // TODO: This could expire
        const scope = "https://www.googleapis.com/auth/business.manage openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email" // Scope returned from exchaging code for tokens

        // 1st Step
        // const authorizationUrl = oauth2Client.generateAuthUrl({ access_type: "offline", scope: scopes, include_granted_scopes: true, prompt: "consent" })
        // console.log("******************************Auth url: ", authorizationUrl)
        // 2nd Step
        // let { tokens } = await oauth2Client.getToken("4/0ARtbsJpbL6r6rQJWiaKSPS2b8W20HYzPl2WwEdnT3RSSqDX4JUmn2ujUugDcOzsyqqkhLQ")
        oauth2Client.setCredentials({ refresh_token, scope })
        const res = await oauth2Client.getAccessToken()

        return res.token ?? ""
    }


    private getMappedReviews(googleReviews: GoogleReview[]): ReviewDto[] {
        const reviews: ReviewDto[] = []

        // Reviews are iterated from newest to oldest
        for (let review of googleReviews) {
            if (review.starRating === "STAR_RATING_UNSPECIFIED" || !review.comment) continue

            const goodReview: ReviewDto = {
                id: review.reviewId,
                avatar: "",
                // avatar: review.reviewer.profilePhotoUrl,
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