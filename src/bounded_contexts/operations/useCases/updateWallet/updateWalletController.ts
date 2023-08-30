import { BaseController } from "../../../../core/infra/BaseController";
import { UpdateWalletDto } from "./updateWalletDto";
import { UpdateWallet } from "./updateWallet";

export class UpdateWalletController extends BaseController {
    private _updateWallet: UpdateWallet;

    constructor(updateWallet: UpdateWallet) {
        super();
        this._updateWallet = updateWallet;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: UpdateWalletDto = {
                customerId: this.req.params.customerId,
                amountToCharge: this.req.body.amountToCharge,
                paymentMethodForCharging: this.req.body.paymentMethodForCharging,
                datesOfCharge: this.req.body.datesOfCharge,
                isEnabled: this.req.body.isEnabled,
            };

            await this.updateWallet.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter updateWallet
     * @return {UpdateWallet}
     */
    public get updateWallet(): UpdateWallet {
        return this._updateWallet;
    }
}
