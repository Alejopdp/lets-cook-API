import { BaseController } from "../../../../core/infra/BaseController";
import { Locale } from "../../domain/locale/Locale";
import { MoveNextBillingDate } from "./moveNextBillingDate";
import { MoveNextBillingDateDto } from "./moveNextBillingDateDto";
import { MoveNextBillingDatePresenter } from "./moveNextBillingDatePresenter";

export class MoveNextBillingDateController extends BaseController {
    private _moveNextBillingDate: MoveNextBillingDate;
    private _moveNextBillingDatePresenter: MoveNextBillingDatePresenter;

    constructor(moveNextBillingDate: MoveNextBillingDate, moveNextBillingDatePresenter: MoveNextBillingDatePresenter) {
        super();
        this._moveNextBillingDate = moveNextBillingDate;
        this._moveNextBillingDatePresenter = moveNextBillingDatePresenter;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: MoveNextBillingDateDto = {
                subscriptionId: this.req.params.id,
                nextBillingDate: new Date(this.req.body.nextBillingDate),
                locale: Locale.es,
            };

            const result = await this.moveNextBillingDate.execute(dto);
            // const presented = this.moveNextBillingDatePresenter.present(result)

            return this.ok(this.res);
        } catch (error) {
            return this.fail(error);
        }
    }

    /**
     * Getter moveNextBillingDateBilling
     * @return {MoveNextBillingDate}
     */
    public get moveNextBillingDate(): MoveNextBillingDate {
        return this._moveNextBillingDate;
    }

    /**
     * Getter moveNextBillingDatePresenter
     * @return {MoveNextBillingDatePresenter}
     */
    public get moveNextBillingDatePresenter(): MoveNextBillingDatePresenter {
        return this._moveNextBillingDatePresenter;
    }
}
