import { BaseController } from "../../../../core/infra/BaseController";
import { ChargeMoneyToWalletUseCase } from "./chargeMoneyToWallet";
import { ChargeMoneyToWalletDto } from "./chargeMoneyToWalletDto";

export class ChargeMoneyToWalletController extends BaseController {
    private _chargeMoneyToWallet: ChargeMoneyToWalletUseCase;

    constructor(chargeMoneyToWallet: ChargeMoneyToWalletUseCase) {
        super();
        this._chargeMoneyToWallet = chargeMoneyToWallet;
    }

    protected async executeImpl(): Promise<any> {
        try {
            const dto: ChargeMoneyToWalletDto = {
                customerId: this.req.params.customerId,
                amountToCharge: this.req.body.amountToCharge,
            };

            await this.chargeMoneyToWallet.execute(dto);

            return this.ok(this.res);
        } catch (error: any) {
            return this.fail(error);
        }
    }

    /**
     * Getter chargeMoneyToWalletUseCase
     * @return {ChargeMoneyToWalletUseCase}
     */
    public get chargeMoneyToWallet(): ChargeMoneyToWalletUseCase {
        return this._chargeMoneyToWallet;
    }
}
