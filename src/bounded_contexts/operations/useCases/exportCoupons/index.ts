import { xlsxService } from "../../application/exportService";
import { mongooseCouponRepository } from "../../infra/repositories/coupon";
import { ExportCoupons } from "./exportCoupons";
import { ExportCouponsController } from "./exportCouponsController";

export const exportCoupons: ExportCoupons = new ExportCoupons(mongooseCouponRepository, xlsxService);
export const exportCouponsController: ExportCouponsController = new ExportCouponsController(exportCoupons);
