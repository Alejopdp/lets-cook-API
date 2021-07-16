import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetShippingRate } from "./getShippingRate";
import { GetShippingRateDto } from "./getShippingRateDto";

export class GetShippingRateController extends BaseController {
    private _getShippingRate: GetShippingRate;

    constructor(getShippingRate: GetShippingRate) {
        super();
        this._getShippingRate = getShippingRate;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetShippingRateDto = {
                latitude: parseFloat(this.req.params.latitude),
                longitude: parseFloat(this.req.params.longitude),
            };
            const result = await this.getShippingRate.execute(dto);

            return this.ok(this.res, result);
        } catch (error) {
            logger.error(error);
            return this.fail(error);
        }
    }

    /**
     * Getter getShippingRate
     * @return {GetShippingRate}
     */
    public get getShippingRate(): GetShippingRate {
        return this._getShippingRate;
    }
}
