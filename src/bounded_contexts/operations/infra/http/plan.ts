import express from "express";
import multer from "multer";
import { createPlanController } from "../../useCases/createPlan";
import { getPlanListController } from "../../useCases/getPlanList";

const planRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// GETs
planRouter.get("/", (req, res) => getPlanListController.execute(req, res));

// POSTs
planRouter.post("/", multer(options).single("planImage"), (req, res) => createPlanController.execute(req, res));

export { planRouter };
