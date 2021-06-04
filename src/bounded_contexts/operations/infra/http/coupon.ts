import express from "express";
import multer from "multer";
import { createCouponController } from "../../useCases/createCoupon";
// import { deletePlanController } from "../../useCases/deletePlan";
// import { getAdditionalPlanListController } from "../../useCases/getAdditionalPlanList";
// import { getPlanByIdController } from "../../useCases/getPlanById";
import { getCouponListController } from "../../useCases/getCouponList";
// import { togglePlanStateController } from "../../useCases/togglePlanState";
// import { updatePlanController } from "../../useCases/updatePlan";

const couponRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// // GETs
couponRouter.get("/", (req, res) => getCouponListController.execute(req, res));
// planRouter.get("/additionals", (req, res) => getAdditionalPlanListController.execute(req, res));
// planRouter.get("/:id", (req, res) => getPlanByIdController.execute(req, res));

// // PUT
// planRouter.put("/toggle-state/:id", (req, res) => togglePlanStateController.execute(req, res));
// planRouter.put("/:id", multer(options).single("planImage"), (req, res) => updatePlanController.execute(req, res));

// POSTs
couponRouter.post("/", multer(options).single(""), (req, res) => createCouponController.execute(req, res));

// // DELETEs
// planRouter.delete("/:id", (req, res) => deletePlanController.execute(req, res));

export { couponRouter };
