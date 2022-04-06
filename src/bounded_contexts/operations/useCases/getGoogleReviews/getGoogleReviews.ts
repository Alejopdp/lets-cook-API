import { GetGoogleReviewsDto } from "./getGoogleReviewsDto";
const { google } = require("googleapis");

export class GetGoogleReviews {
    constructor() {
        const business = google.bu;
    }

    public async execute(dto: GetGoogleReviewsDto): Promise<any> {}
}
