import { googleReviewsService } from "../../application/reviewsService";
import { GetGoogleReviews } from "./getGoogleReviews";
import { GetGoogleReviewsController } from "./getGoogleReviewsController";

export const getGoogleReviews: GetGoogleReviews = new GetGoogleReviews(googleReviewsService)
export const getGoogleReviewsController: GetGoogleReviewsController = new GetGoogleReviewsController(getGoogleReviews)