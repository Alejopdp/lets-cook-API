import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetCouponValidation } from "./getCouponValidation";
import { GetCouponValidationController } from "./getCouponValidationController";

export const getCouponValidation: GetCouponValidation = new GetCouponValidation(mongooseCouponRepository, mongooseSubscriptionRepository);
export const getCouponValidationController: GetCouponValidationController = new GetCouponValidationController(getCouponValidation);
