import express from "express";
import { createUserAsAdminController } from "../../useCases/createUserAsAdmin";

const userRouter = express.Router();

// // GETs
// roleRouter.get("/", (req, res) => getRoleListController.execute(req, res));

// POSTs
userRouter.post("/", (req, res) => createUserAsAdminController.execute(req, res));

export { userRouter };
