import express from "express";
import multer from "multer";
import { createCouponController } from "../../useCases/createCoupon";
// import { getAdditionalPlanListController } from "../../useCases/getAdditionalPlanList";
import { getCouponByIdController } from "../../useCases/getCouponById";
import { getCouponListController } from "../../useCases/getCouponList";
import { getCouponValidationController } from "../../useCases/couponValidation";
import { updateCouponStateController } from "../../useCases/updateCouponState";
import { exportCouponsController } from "../../useCases/exportCoupons";
import { createManyCouponsWithCsvController } from "../../useCases/createManyCoupons";
import { deleteCouponController } from "../../useCases/deleteCoupon";
import { middleware } from "../../../../shared/middleware/index";
import { Permission } from "../../../../bounded_contexts/IAM/domain/permission/Permission";

const couponRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// // GETs
couponRouter.get("/", middleware.ensureAdminAuthenticated([Permission.VIEW_COUPONS]), (req, res) =>
    getCouponListController.execute(req, res)
);
couponRouter.get("/:id", middleware.ensureAdminAuthenticated([Permission.VIEW_COUPONS]), (req, res) =>
    getCouponByIdController.execute(req, res)
);
couponRouter.get("/validation/:code", middleware.addCurrentUser(), (req, res) => getCouponValidationController.execute(req, res));

// // PUT
couponRouter.put(
    "/:id",
    [multer(options).single(""), middleware.ensureAdminAuthenticated([Permission.UPDATE_COUPON])],
    (req: any, res: any) => updateCouponStateController.execute(req, res)
);

// POSTs
couponRouter.post(
    "/",
    [multer(options).single(""), middleware.ensureAdminAuthenticated([Permission.CREATE_COUPON])],
    (req: any, res: any) => createCouponController.execute(req, res)
);
couponRouter.post(
    "/import",
    [multer(options).single("coupons"), middleware.ensureAdminAuthenticated([Permission.CREATE_COUPON])],
    (req: any, res: any) => createManyCouponsWithCsvController.execute(req, res)
);
couponRouter.post("/export", middleware.ensureAdminAuthenticated([Permission.EXPORT_COUPONS]), (req, res) =>
    exportCouponsController.execute(req, res)
);

// DELETE
couponRouter.delete("/:id", middleware.ensureAdminAuthenticated([Permission.DELETE_COUPON]), (req, res) =>
    deleteCouponController.execute(req, res)
);

export { couponRouter };
