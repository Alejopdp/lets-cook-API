import { s3Service } from "../../application/storageService";
import { mongooseCouponRepository, } from "../../infra/repositories/coupon";
import { CreateCoupon } from "./createCouponCSV";
import { CreateCouponControllerCSV } from "./createCouponControllerCSV";

// export const createPlan: CreatePlan = new CreatePlan(mockPlanRepository, s3Service);
export const createCoupon: CreateCoupon = new CreateCoupon(mongooseCouponRepository, s3Service);
export const createCouponControllerCSV: CreateCouponControllerCSV = new CreateCouponControllerCSV(createCoupon);
