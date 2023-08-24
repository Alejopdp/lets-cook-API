import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { chargeMoneyToWallet } from "../chargeMoneyToWallet";
import { ChargeWalletJob } from "./chargeWalletJob";

export const chargeWalletJob = new ChargeWalletJob(mongooseCustomerRepository, chargeMoneyToWallet)