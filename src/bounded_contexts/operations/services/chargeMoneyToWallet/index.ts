import { stripeService } from "../../application/paymentService";
import { ChargeMoneyToWallet } from "./chargeMoneyToWallet";

export const chargeMoneyToWallet = new ChargeMoneyToWallet(stripeService)