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

const userRouter = express.Router();

// // GETs
userRouter.get("/:id", (req, res) => getUserByIdController.execute(req, res));
userRouter.get("/login", (req, res) => loginWithEmailController.execute(req, res));
userRouter.get("/generate-password", middleware.ensureTokenValid(), (req, res) => getDataForGeneratingPasswordController.execute(req, res));
userRouter.get("/verify-token", middleware.ensureTokenValid(), (req, res) => res.status(200));
userRouter.get("/", (req, res) => getAllUsersController.execute(req, res));

// POSTs
userRouter.post("/generate-password", middleware.ensureTokenValid(), (req, res) => generateNewPasswordController.execute(req, res));
userRouter.post("/", (req, res) => createUserAsAdminController.execute(req, res));

// PUTs
userRouter.put("/:id", (req, res) => updateUserController.execute(req, res));

// DELETEs
userRouter.delete("/:id", (req, res) => deleteUserController.execute(req, res));

export { userRouter };
