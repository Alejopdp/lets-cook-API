import { s3Service } from "../../application/storageService";
import { mongooseCouponRepository, } from "../../infra/repositories/coupon";
import {  } from "../../infra/repositories/coupon/mockCouponRepository";
import { CreateCoupon } from "./createCoupon";
import { CreateCouponController } from "./createCouponController";

// export const createPlan: CreatePlan = new CreatePlan(mockPlanRepository, s3Service);
export const createCoupon: CreateCoupon = new CreateCoupon(mongooseCouponRepository, s3Service);
export const createCouponController: CreateCouponController = new CreateCouponController(createCoupon);
