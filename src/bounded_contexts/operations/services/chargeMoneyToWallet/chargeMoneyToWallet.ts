import { IPaymentService } from "../../application/paymentService/IPaymentService";
import { WalletMovementLogType } from "../../domain/customer/wallet/WalletMovementLog/WalletMovementLogTypeEnum";
import { ChargeMoneyToWalletDto } from "./ChargeMoneyToWalletDto";

export class ChargeMoneyToWallet {

    private _paymentService: IPaymentService;

    constructor(paymentService: IPaymentService) {
        this._paymentService = paymentService
    }

    public async execute(dto: ChargeMoneyToWalletDto): Promise<any> {
        const customer = dto.customer

        const paymentMethod = customer.paymentMethods.find(paymentMethod => paymentMethod.id.toString() === dto.paymentMethodId)

        if (!paymentMethod && dto.paymentMethodId) throw new Error("No se encontró el método de pago")

        customer.chargeMoneyToWallet(dto.amountToCharge);

        const res = await this.paymentService.paymentIntent(dto.amountToCharge, dto.paymentMethodId ? paymentMethod?.stripeId ?? "" : customer.getPaymentMethodForChargingTheWallet().stripeId, customer.email, customer.stripeId, true)

        if (res.status !== "succeeded") throw new Error("Ocurrió un error al cargar el dinero en la cartera")

    }


    /**
     * Getter paymentService
     * @return {IPaymentService}
     */
    public get paymentService(): IPaymentService {
        return this._paymentService;
    }
}