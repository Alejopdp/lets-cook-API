import express from "express";
import multer from "multer";
import { createPlanController } from "../../useCases/createPlan";
import { deletePlanController } from "../../useCases/deletePlan";
import { getPlanListController } from "../../useCases/getPlanList";
import { togglePlanStateController } from "../../useCases/togglePlanState";

const planRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// GETs
planRouter.get("/", (req, res) => getPlanListController.execute(req, res));

// PUT
planRouter.put("/toggle-state/:id", (req, res) => togglePlanStateController.execute(req, res));

// POSTs
planRouter.post("/", multer(options).single("planImage"), (req, res) => createPlanController.execute(req, res));

// DELETEs
planRouter.delete("/:id", (req, res) => deletePlanController.execute(req, res));

export { planRouter };
