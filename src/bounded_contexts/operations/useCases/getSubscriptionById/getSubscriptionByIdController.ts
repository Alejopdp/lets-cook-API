import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { GetSubscriptionById } from "./getSubscriptionById";
import { GetSubscriptionByIdDto } from "./getSubscriptionByIdDto";

export class GetSubscriptionByIdController extends BaseController {
    private _getSubscriptionById: GetSubscriptionById;

    constructor(getSubscriptionById: GetSubscriptionById) {
        super();
        this._getSubscriptionById = getSubscriptionById;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: GetSubscriptionByIdDto = {
                subscriptionId: this.req.params.id,
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
                queryDate: new Date(),
            };
            const result = await this.getSubscriptionById.execute(dto);

            return this.ok(this.res, result);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter getDataForCreatingARecipe
     * @return {GetSubscriptionById}
     */
    public get getSubscriptionById(): GetSubscriptionById {
        return this._getSubscriptionById;
    }
}
