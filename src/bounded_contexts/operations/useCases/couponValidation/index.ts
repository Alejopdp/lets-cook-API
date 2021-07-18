import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { mongooseCustomerRepository } from "../../infra/repositories/customer";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { mongooseSubscriptionRepository } from "../../infra/repositories/subscription";
import { GetCouponValidation } from "./getCouponValidation";
import { GetCouponValidationController } from "./getCouponValidationController";
import { GetCouponValidationPresenter } from "./getCouponValidationPresenter";

export const getCouponValidation: GetCouponValidation = new GetCouponValidation(
    mongooseCouponRepository,
    mongooseSubscriptionRepository,
    mongoosePlanRepository
);
export const getCouponValidationPresenter: GetCouponValidationPresenter = new GetCouponValidationPresenter();
export const getCouponValidationController: GetCouponValidationController = new GetCouponValidationController(
    getCouponValidation,
    getCouponValidationPresenter
);
