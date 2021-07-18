import express from "express";
import multer from "multer";
import { createRateController } from "../../useCases/createRate";
import { updateRateController } from "../../useCases/updateRate";
import { deleteRateController } from "../../useCases/deleteRate";
import { getRateListController } from "../../useCases/getRateList";

const rateRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// GETs
rateRouter.get("/", (req, res) => getRateListController.execute(req, res));

// PUT
rateRouter.put("/:id", multer(options).single(""), (req, res) => updateRateController.execute(req, res));
rateRouter.put("/delete-rate/:id", (req, res) => deleteRateController.execute(req, res));

// POSTs
rateRouter.post("/", multer(options).single(""), (req, res) => createRateController.execute(req, res));

export { rateRouter as recipeRatingRouter };
