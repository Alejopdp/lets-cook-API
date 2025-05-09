import express from "express";
import { createUserAsAdminController } from "../../useCases/createUserAsAdmin";
import { getDataForGeneratingPasswordController } from "../../useCases/getDataForGeneratingPassword";
import { loginWithEmailController } from "../../useCases/loginWithEmail";
import { middleware } from "../../../../shared/middleware";
import { generateNewPasswordController } from "../../useCases/generateNewPassword";
import { getUserByIdController } from "../../useCases/getUserById";
import { updateUserController } from "../../useCases/updateUser";
import { getAllUsersController } from "../../useCases/getAllUsers";
import { deleteUserController } from "../../useCases/deleteUser";
import { forgotPasswordController } from "../../useCases/forgotPassword";

const userRouter = express.Router();

// GETs
userRouter.get("/generate-password", middleware.ensureTokenValid(), (req, res) => getDataForGeneratingPasswordController.execute(req, res));
userRouter.get("/verify-token", middleware.ensureTokenValid(), (req, res) => res.status(200).json({}));
userRouter.get("/", (req, res) => getAllUsersController.execute(req, res)); // TODO: Add middleware
userRouter.get("/:id", (req, res) => getUserByIdController.execute(req, res)); // TODO: Add middleware

// POSTs
userRouter.post("/login", (req, res) => loginWithEmailController.execute(req, res));
userRouter.post("/generate-password", middleware.ensureTokenValid(), (req, res) => generateNewPasswordController.execute(req, res));
userRouter.post("/", (req, res) => createUserAsAdminController.execute(req, res)); // TODO: Add middleware

// PUTs
userRouter.put("/forgot-password/:email", (req, res) => forgotPasswordController.execute(req, res));
userRouter.put("/:id", (req, res) => updateUserController.execute(req, res));

// DELETEs
userRouter.delete("/:id", (req, res) => deleteUserController.execute(req, res));

export { userRouter };
