import { BaseController } from "../../../../core/infra/BaseController";
import { UpdateWalletDto } from "./updateWalletDto";
import { UpdateWallet } from "./updateWallet";
import { Locale } from "../../domain/locale/Locale";

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
                locale: (<any>Locale)[this.req.query.locale as string] || Locale.es,
            };

            const presentedWallet = await this.updateWallet.execute(dto);

            return this.ok(this.res, presentedWallet);
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
