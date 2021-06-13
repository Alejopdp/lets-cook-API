import { s3Service } from "../../application/storageService";
import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { GetCouponList } from "./getCouponList";
import { GetCouponListController } from "./getCouponListController";

// export const getPlanList = new GetPlanList(mockPlanRepository, s3Service);
export const getCouponList = new GetCouponList(mongooseCouponRepository, s3Service);
export const getCouponListController = new GetCouponListController(getCouponList);
