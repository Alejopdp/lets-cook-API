import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { CreateWallet } from "./createWallet";
import { CreateWalletController } from "./createWalletController";

export const createWallet = new CreateWallet(mongooseCustomerRepository)
export const createWalletController = new CreateWalletController(createWallet)