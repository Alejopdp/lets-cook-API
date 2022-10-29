import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetGoogleReviews } from "./getGoogleReviews";
import { GetGoogleReviewsDto } from "./getGoogleReviewsDto";

export class GetGoogleReviewsController extends BaseController {
    private _getGoogleReviews: GetGoogleReviews;

    constructor(getGoogleReviews: GetGoogleReviews) {
        super();
        this._getGoogleReviews = getGoogleReviews;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetGoogleReviewsDto = {
                locale: (<any>Locale)[this.req.query.locale as string],
            };

            const result = await this.getGoogleReviews.execute(dto);

            return this.ok(this.res, result);
        } catch (error) {
            return this.fail(error as Error);
        }
    }

    /**
     * Getter GetGoogleReviews
     * @return {GetGoogleReviews}
     */
    public get getGoogleReviews(): GetGoogleReviews {
        return this._getGoogleReviews;

    }
}

