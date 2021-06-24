import express from "express";
import multer from "multer";
import { createCouponController } from "../../useCases/createCoupon";
import { createCouponControllerCSV } from "../../useCases/createCouponFromCSV";
// import { getAdditionalPlanListController } from "../../useCases/getAdditionalPlanList";
import { codeValidationController } from "../../useCases/validateCodeToRecoverPassword";
import { emailValidatedController } from "../../useCases/customerEmailValidation";
import { signUpController } from "../../useCases/signUp";
import { signInController } from "../../useCases/signIn";
import { forgotPasswordController } from "../../useCases/forgotPassword";
import { updatePasswordController } from "../../useCases/updatePassword";

const customerRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// // GETs
customerRouter.get("/:email", (req, res) => emailValidatedController.execute(req, res));

// // PUT
customerRouter.put("/forgot-password/:email", (req, res) => forgotPasswordController.execute(req, res));
customerRouter.put("/reset-password/:email", (req, res) => updatePasswordController.execute(req, res));

// // POSTs
customerRouter.post("/sign-up", (req, res) => signUpController.execute(req, res));
customerRouter.post("/sign-in", (req, res) => signInController.execute(req, res));
customerRouter.post("/validation/:code", (req, res) => codeValidationController.execute(req, res));
// couponRouter.post("/import", multer(options).single("coupons"), (req, res) => createCouponControllerCSV.execute(req, res));

export { customerRouter as customerRouter };
