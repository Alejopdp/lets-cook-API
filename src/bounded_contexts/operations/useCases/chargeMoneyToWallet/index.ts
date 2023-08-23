import { stripeService } from "../../application/paymentService";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { ChargeMoneyToWallet } from "../../services/chargeMoneyToWallet/chargeMoneyToWallet";
import { ChargeMoneyToWalletUseCase } from "./chargeMoneyToWallet";
import { ChargeMoneyToWalletController } from "./chargeMoneyToWalletController";

const chargeMoneyToWalletService = new ChargeMoneyToWallet(stripeService);
export const chargeMoneyToWalletUseCase = new ChargeMoneyToWalletUseCase(mongooseCustomerRepository, chargeMoneyToWalletService);
export const chargeMoneyToWalletController = new ChargeMoneyToWalletController(chargeMoneyToWalletUseCase);
