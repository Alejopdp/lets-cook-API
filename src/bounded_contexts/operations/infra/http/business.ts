import express from "express";
import { getGoogleReviewsController } from "../../useCases/getGoogleReviews";

const businessRouter = express.Router();

// GETs
businessRouter.get("/reviews", (req, res) => getGoogleReviewsController.execute(req, res));

export { businessRouter };
