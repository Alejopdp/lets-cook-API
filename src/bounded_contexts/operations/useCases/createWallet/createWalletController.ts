import { BaseController } from "../../../../core/infra/BaseController";
import { CreateWalletDto } from "./createWalletDto";
import { CreateWallet } from "./createWallet";

export class CreateWalletController extends BaseController {
    private _createWallet: CreateWallet;

    constructor(createWallet: CreateWallet) {
        super();
        this._createWallet = createWallet;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: CreateWalletDto = {
                customerId: this.req.params.customerId,
                amountToCharge: this.req.body.amountToCharge,
                paymentMethodForCharging: this.req.body.paymentMethodForCharging,
                datesOfCharge: this.req.body.datesOfCharge,
            };

            await this.createWallet.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter createWallet
     * @return {CreateWallet}
     */
    public get createWallet(): CreateWallet {
        return this._createWallet;
    }
}
