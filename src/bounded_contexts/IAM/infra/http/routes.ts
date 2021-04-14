import express from "express";
import { signUpController } from "../../useCases/signUp";

const userRouter = express.Router();

userRouter.post("/", (req, res) => signUpController.execute(req, res));

export { userRouter };
