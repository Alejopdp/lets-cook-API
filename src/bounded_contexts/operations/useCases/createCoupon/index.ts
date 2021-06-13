import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { CreateCoupon } from "./createCoupon";
import { CreateCouponController } from "./createCouponController";

export const createCoupon: CreateCoupon = new CreateCoupon(mongooseCouponRepository);
export const createCouponController: CreateCouponController = new CreateCouponController(createCoupon);
