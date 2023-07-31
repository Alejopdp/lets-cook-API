import { v3S3Service } from "../../application/storageService";
import { mongooseCouponRepository, } from "../../infra/repositories/coupon";
import { CreateCoupon } from "./createCouponCSV";
import { CreateCouponControllerCSV } from "./createCouponControllerCSV";

export const createCoupon: CreateCoupon = new CreateCoupon(mongooseCouponRepository, v3S3Service);
export const createCouponControllerCSV: CreateCouponControllerCSV = new CreateCouponControllerCSV(createCoupon);
