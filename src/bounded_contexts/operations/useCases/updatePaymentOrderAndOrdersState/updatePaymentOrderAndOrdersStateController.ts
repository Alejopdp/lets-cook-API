import { ReadStream } from "fs";
import { BaseController } from "../../../../core/infra/BaseController";
import { Month } from "../../domain/recipe/Months";
import { RecipeDifficultyLevel } from "../../domain/recipe/RecipeGeneralData/RecipeDifficultyLevel";
import { UpdatePaymentOrderAndOrdersState } from "./updatePaymentOrderAndOrdersState";
import { UpdatePaymentOrderAndOrdersStateDto } from "./updatePaymentOrderAndOrdersStateDto";
import { Address } from "../../domain/address/Address";

export class UpdatePaymentOrderAndOrdersStateController extends BaseController {
    private _updatePaymentOrderAndOrdersState: UpdatePaymentOrderAndOrdersState;

    constructor(updatePaymentOrderAndOrdersState: UpdatePaymentOrderAndOrdersState) {
        super();
        this._updatePaymentOrderAndOrdersState = updatePaymentOrderAndOrdersState;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdatePaymentOrderAndOrdersStateDto = {
                paymentOrderId: this.req.params.id,
                paymentOrderState: this.req.body.state,
            };

            const result = await this.updatePaymentOrderAndOrdersState.execute(dto);

            return this.ok(this.res, { billedPaymentOrderHumanId: result.billedPaymentOrderHumanId });
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter updatePaymentOrderAndOrdersStateBilling
     * @return {UpdatePaymentOrderAndOrdersState}
     */
    public get updatePaymentOrderAndOrdersState(): UpdatePaymentOrderAndOrdersState {
        return this._updatePaymentOrderAndOrdersState;
    }
}
