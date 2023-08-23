import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { UpdateWallet } from "./updateWallet";
import { UpdateWalletController } from "./updateWalletController";

export const updateWallet = new UpdateWallet(mongooseCustomerRepository)
export const updateWalletController = new UpdateWalletController(updateWallet)