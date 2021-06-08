import { s3Service } from "../../application/storageService";
import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { UpdateCoupon } from "./updateCouponState";
import { UpdateCouponStateController } from "./updateCouponStateController";

// export const updatePlan: UpdatePlan = new UpdatePlan(mockPlanRepository, s3Service);
export const updateCouponState: UpdateCoupon = new UpdateCoupon(mongooseCouponRepository, s3Service);
export const updateCouponStateController: UpdateCouponStateController = new UpdateCouponStateController(updateCouponState);
