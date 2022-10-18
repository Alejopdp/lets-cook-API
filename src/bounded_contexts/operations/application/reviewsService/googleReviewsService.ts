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
            const oauth2Client = new google.auth.OAuth2({ clientId: "859787193343-oqoqiqefal2s6vkc2sga1lhjgaskh855.apps.googleusercontent.com", clientSecret: "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", redirectUri: process.env.CUSTOMER_ORIGIN_URL, forceRefreshOnFailure: true })
            await oauth2Client.getAccessToken(async (err, token, res) => {
                console.log("Token err: ", err)
                console.log("Token: ", token)
                console.log("tokenRes: ", res)
                const reviewRes = await axios.get(`https://mybusiness.googleapis.com/v4/accounts/104947658459106658401/locations/5728607255678643306/reviews`, { headers: { "Authorization": `Bearer ${token}` } })

                if (reviewRes.status === 200) reviews = this.getMappedReviews(reviewRes.data.reviews)

                return []
            })

            return reviews
            // const accessToken = await this.getAccessToken()
        } catch (error) {
            console.log("Error while trying to get all the reviews")
            console.error(error)
            //@ts-ignore
            console.log(error.response.data)
            return []
        }
    }

    private async getAccessToken(): Promise<string> {
        const scopes = ["https://www.googleapis.com/auth/plus.business.manage"]
        const oauth2Client = new google.auth.OAuth2({ clientId: "859787193343-oqoqiqefal2s6vkc2sga1lhjgaskh855.apps.googleusercontent.com", clientSecret: "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", redirectUri: process.env.CUSTOMER_ORIGIN_URL, forceRefreshOnFailure: true })
        // const authorizationUrl = oauth2Client.generateAuthUrl({ access_type: "offline", scope: scopes, include_granted_scopes: true })
        // console.log("******************************Auth url: ", authorizationUrl)
        // let { tokens } = await oauth2Client.getToken("4/0ARtbsJpdncLMTf_uUg8F9iDuApYjeRT684_tkNI4FSTbyeddfxsSquUSOwd_il8J2RtZiw")
        // oauth2Client.setCredentials(tokens)
        // console.log("TOKEN RES: ", tokens);
        const res = await oauth2Client.getAccessToken((err, token, res) => {
            console.log("Token err: ", err)
            console.log("Token: ", token)
            console.log("tokenRes: ", res)
        })

        // return ""
        return res.token ?? ""
        // const auth = new google.auth.GoogleAuth({ keyFile: `${__dirname}/../../../../../letscook-001-020bf42f3fa6.json`, scopes: ["https://www.googleapis.com/auth/plus.business.manage"] })
        // const token = await auth.getAccessToken()

        // return token ?? ""
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