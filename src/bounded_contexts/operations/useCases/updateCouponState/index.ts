import { v3S3Service } from "../../application/storageService";
import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { UpdateCoupon } from "./updateCouponState";
import { UpdateCouponStateController } from "./updateCouponStateController";

export const updateCouponState: UpdateCoupon = new UpdateCoupon(mongooseCouponRepository, v3S3Service);
export const updateCouponStateController: UpdateCouponStateController = new UpdateCouponStateController(updateCouponState);
