import { v3S3Service } from "../../application/storageService";
import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { GetCouponList } from "./getCouponList";
import { GetCouponListController } from "./getCouponListController";

export const getCouponList = new GetCouponList(mongooseCouponRepository, v3S3Service);
export const getCouponListController = new GetCouponListController(getCouponList);
