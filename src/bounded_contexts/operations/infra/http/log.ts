import express from "express";
import { getLogsController } from "../../useCases/getLogs";

const logRouter = express.Router();

// GET
logRouter.get("/", (req, res) => getLogsController.execute(req, res));

export { logRouter };
