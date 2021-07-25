import express from "express";
import multer from "multer";
import { codeValidationController } from "../../useCases/validateCodeToRecoverPassword";
import { emailValidatedController } from "../../useCases/customerEmailValidation";
import { signUpController } from "../../useCases/signUp";
import { signInController } from "../../useCases/signIn";
import { forgotPasswordController } from "../../useCases/forgotPassword";
import { updatePasswordController } from "../../useCases/updatePassword";
import { socialNetworkAuthController } from "../../useCases/signInSocial";
import { updateCustomerController } from "../../useCases/updateCustomer";
import { updateCustomerEmailController } from "../../useCases/updateCustomerEmail";
import { updateShippingCustomerController } from "../../useCases/updateCustomerShipping";
import { updateCustomerBillingController } from "../../useCases/updateCustomerBilling";
import { updateCustomerInfoController } from "../../useCases/updateCustomerInfo";
import { updatePaymentMethodController } from "../../useCases/updatePaymentMethod";
import { getCustomerListController } from "../../useCases/getCustomerList";
import { getCustomerByNameController } from "../../useCases/getCustomerListByName";
import { deleteCustomerController } from "../../useCases/deleteCustomer";
import { getCustomerByIdController } from "../../useCases/getCustomerById";
import { createCustomerByAdminController } from "../../useCases/createCustomerByAdmin";
import { getCustomerInformationAsAdminController } from "../../useCases/getCustomerInformationAsAdmin";

const customerRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// // GETs
// customerRouter.get("/:email", (req, res) => emailValidatedController.execute(req, res));
customerRouter.get("/", (req, res) => getCustomerListController.execute(req, res));
customerRouter.get("/by-name/:name", (req, res) => getCustomerByNameController.execute(req, res));
customerRouter.get("/:id", (req, res) => getCustomerByIdController.execute(req, res));
customerRouter.get("/information-as-admin/:id", (req, res) => getCustomerInformationAsAdminController.execute(req, res));

// // PUT
customerRouter.put("/forgot-password/:email", (req, res) => forgotPasswordController.execute(req, res));
customerRouter.put("/reset-password/:email", (req, res) => updatePasswordController.execute(req, res));
customerRouter.put("/update/:id", (req, res) => updateCustomerController.execute(req, res));
customerRouter.put("/update-customer/:id", (req, res) => updateCustomerController.execute(req, res));
customerRouter.put("/update-email/:id", (req, res) => updateCustomerEmailController.execute(req, res));
customerRouter.put("/update-shipping/:id", (req, res) => updateShippingCustomerController.execute(req, res));
customerRouter.put("/update-billing/:id", (req, res) => updateCustomerBillingController.execute(req, res));
customerRouter.put("/update-info/:id", (req, res) => updateCustomerInfoController.execute(req, res));
customerRouter.put("/update-payment/:id", (req, res) => updatePaymentMethodController.execute(req, res));
customerRouter.put("/delete/:id", (req, res) => deleteCustomerController.execute(req, res));

// // POSTs
customerRouter.post("/sign-up", (req, res) => signUpController.execute(req, res));
customerRouter.post("/create", (req, res) => createCustomerByAdminController.execute(req, res));
customerRouter.post("/sign-in", (req, res) => signInController.execute(req, res));
customerRouter.post("/validation/:code", (req, res) => codeValidationController.execute(req, res));
customerRouter.post("/social-auth/:token", (req, res) => socialNetworkAuthController.execute(req, res));

export { customerRouter as customerRouter };
