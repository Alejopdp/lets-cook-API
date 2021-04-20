import express from "express";
import { createUserAsAdminController } from "../../useCases/createUserAsAdmin";
import { loginWithEmailController } from "../../useCases/loginWithEmail";

const userRouter = express.Router();

// // GETs
userRouter.get("/login", (req, res) => loginWithEmailController.execute(req, res));

// POSTs
userRouter.post("/", (req, res) => createUserAsAdminController.execute(req, res));

export { userRouter };
