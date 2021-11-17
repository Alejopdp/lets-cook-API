import { xlsxService } from "../../application/exportService";
import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { mongoosePlanRepository } from "../../infra/repositories/plan";
import { CreateManyCoupons } from "./createManyCoupons";
import { CreateManyCouponsWithCsvController } from "./createManyCouponsWithCsvController";
import { CreateManyCouponsPresenter } from "./createManyCouponsWithCsvPresenter";

export const createManyCoupons: CreateManyCoupons = new CreateManyCoupons(mongooseCouponRepository, mongoosePlanRepository);
export const createManyCouponsPresenter: CreateManyCouponsPresenter = new CreateManyCouponsPresenter();
export const createManyCouponsWithCsvController: CreateManyCouponsWithCsvController = new CreateManyCouponsWithCsvController(
    createManyCoupons,
    xlsxService,
    createManyCouponsPresenter
);
