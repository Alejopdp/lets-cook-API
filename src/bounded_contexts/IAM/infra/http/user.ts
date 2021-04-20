import express from "express";
import { createUserAsAdminController } from "../../useCases/createUserAsAdmin";
import { getDataForGeneratingPasswordController } from "../../useCases/getDataForGeneratingPassword";
import { loginWithEmailController } from "../../useCases/loginWithEmail";
import { middleware } from "../../../../shared/middleware";
import { generateNewPasswordController } from "../../useCases/generateNewPassword";

const userRouter = express.Router();

// // GETs
userRouter.get("/login", (req, res) => loginWithEmailController.execute(req, res));
userRouter.get("/generate-password", middleware.ensureTokenValid(), (req, res) => getDataForGeneratingPasswordController.execute(req, res));

// POSTs
userRouter.post("/generate-password", middleware.ensureTokenValid(), (req, res) => generateNewPasswordController.execute(req, res));
userRouter.post("/", (req, res) => createUserAsAdminController.execute(req, res));

export { userRouter };
