import express from "express";
import multer from "multer";
import { middleware } from "../../../../shared/middleware";
import { getRestrictionsController } from "../../useCases/getRestrictions";

const restrictionRouter = express.Router();

// GETs
restrictionRouter.get("/", (req, res) => getRestrictionsController.execute(req, res));

export { restrictionRouter };
