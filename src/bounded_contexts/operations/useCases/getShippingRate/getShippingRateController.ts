import { logger } from "../../../../../config";
import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetShippingRate } from "./getShippingRate";
import { GetShippingRateDto } from "./getShippingRateDto";
import { GetShippingRatePresenter } from "./getShippingRatePresenter";

export class GetShippingRateController extends BaseController {
    private _getShippingRate: GetShippingRate;
    private _getShippingRatePresenter: GetShippingRatePresenter;

    constructor(getShippingRate: GetShippingRate, getShippingRatePresenter: GetShippingRatePresenter) {
        super();
        this._getShippingRate = getShippingRate;
        this._getShippingRatePresenter = getShippingRatePresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetShippingRateDto = {
                latitude: parseFloat(this.req.params.latitude),
                longitude: parseFloat(this.req.params.longitude),
            };
            const result = await this.getShippingRate.execute(dto);
            const presented = this.getShippingRatePresenter.present(result);

            return this.ok(this.res, presented);
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

    /**
     * Getter getShippingRatePresenter
     * @return {GetShippingRatePresenter}
     */
    public get getShippingRatePresenter(): GetShippingRatePresenter {
        return this._getShippingRatePresenter;
    }
}
