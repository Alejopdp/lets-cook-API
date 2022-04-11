import express from "express";
import { getAnalyticsController } from "../../useCases/getAnalytics";

const analyticsRouter = express.Router();

// // GETs
analyticsRouter.get("/", (req, res) => getAnalyticsController.execute(req, res));

export { analyticsRouter };
