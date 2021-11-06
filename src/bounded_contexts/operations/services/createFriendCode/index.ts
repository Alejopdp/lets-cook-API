import { CreateFriendCode } from "./createFriendCode";
import { mongooseCouponRepository } from "../../infra/repositories/coupon/";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";

export const createFriendCode: CreateFriendCode = new CreateFriendCode(mongooseCouponRepository, mongooseCustomerRepository);
