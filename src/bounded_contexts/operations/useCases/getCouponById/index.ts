import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { GetCouponById } from "./getCouponById";
import { GetCouponByIdController } from "./getCouponByIdController";

export const getCouponById: GetCouponById = new GetCouponById(mongooseCouponRepository);
export const getCouponByIdController: GetCouponByIdController = new GetCouponByIdController(getCouponById);