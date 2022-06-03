import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetDataForSwappingAPlan } from "./getDataForSwappingAPlan";
import { GetDataForSwappingAPlanDto } from "./getDataForSwappingAPlanDto";
import { GetDataForSwappingAPlanPresenter } from "./getDataForSwappingAPlanPresenter";

export class GetDataForSwappingAPlanController extends BaseController {
    private _getDataForSwappingAPlan: GetDataForSwappingAPlan;
    private _getDataForSwappingAPlanPresenter: GetDataForSwappingAPlanPresenter;

    constructor(getDataForSwappingAPlan: GetDataForSwappingAPlan, getDataForSwappingAPlanPresenter: GetDataForSwappingAPlanPresenter) {
        super();
        this._getDataForSwappingAPlan = getDataForSwappingAPlan;
        this._getDataForSwappingAPlanPresenter = getDataForSwappingAPlanPresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetDataForSwappingAPlanDto = {
                subscriptionId: this.req.params.subscriptionId,
                locale: (<any>Locale)[this.req.query.locale as string],
            };

            const result = await this.getDataForSwappingAPlan.execute(dto);
            const presented = this.getDataForSwappingAPlanPresenter.present(result.subscription, result.plans);

            return this.ok(this.res, presented);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter GetDataForSwappingAPlan
     * @return {GetDataForSwappingAPlan}
     */
    public get getDataForSwappingAPlan(): GetDataForSwappingAPlan {
        return this._getDataForSwappingAPlan;
    }

    /**
     * Getter getDataForSwappingAPlanPresenter
     * @return {GetDataForSwappingAPlanPresenter}
     */
    public get getDataForSwappingAPlanPresenter(): GetDataForSwappingAPlanPresenter {
        return this._getDataForSwappingAPlanPresenter;
    }
}
