import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { GetCouponValidation } from "./getCouponValidation";
import { GetCouponValidationController } from "./getCouponValidationController";

export const getCouponValidation: GetCouponValidation = new GetCouponValidation(mongooseCouponRepository);
export const getCouponValidationController: GetCouponValidationController = new GetCouponValidationController(getCouponValidation);