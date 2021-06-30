import express from "express";
import multer from "multer";
import { createPlanController } from "../../useCases/createPlan";
import { deletePlanController } from "../../useCases/deletePlan";
import { getAdditionalPlanListController } from "../../useCases/getAdditionalPlanList";
import { getPlanByIdController } from "../../useCases/getPlanById";
import { getPlanListController } from "../../useCases/getPlanList";
import { togglePlanStateController } from "../../useCases/togglePlanState";
import { updatePlanController } from "../../useCases/updatePlan";
import { getAdditionalPlansByPlanIdController } from "../../useCases/getAdditionalPlansByPlanId";
import { getPlanVariantsRecipesByWeekListController } from "../../useCases/getPlanVariantsRecipesByWeek";
import { getDataForSwappingAPlanController } from "../../useCases/getDataForSwappingAPlan";

const planRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// GETs
planRouter.get("/", (req, res) => getPlanListController.execute(req, res));
planRouter.get("/additionals", (req, res) => getAdditionalPlanListController.execute(req, res));
planRouter.get("/additionals/:id", (req, res) => getAdditionalPlansByPlanIdController.execute(req, res));
planRouter.get("/plans/week", (req, res) => getPlanVariantsRecipesByWeekListController.execute(req, res));
planRouter.get("/data-for-swapping/:subscriptionId", (req, res) => getDataForSwappingAPlanController.execute(req, res));
planRouter.get("/:id", (req, res) => getPlanByIdController.execute(req, res));

// PUT
planRouter.put("/toggle-state/:id", (req, res) => togglePlanStateController.execute(req, res));
planRouter.put("/:id", multer(options).single("planImage"), (req, res) => updatePlanController.execute(req, res));

// POSTs
planRouter.post("/", multer(options).single("planImage"), (req, res) => createPlanController.execute(req, res));

// DELETEs
planRouter.delete("/:id", (req, res) => deletePlanController.execute(req, res));

export { planRouter };
