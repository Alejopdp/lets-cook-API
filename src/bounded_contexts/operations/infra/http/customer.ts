import express from "express";
import multer from "multer";
import { codeValidationController } from "../../useCases/validateCodeToRecoverPassword";
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
import { exportCustomersController } from "../../services/exportCustomers";
import { addPaymentMethodController } from "../../useCases/addPaymentMethod";
import { checkIfEmailExistsController } from "../../useCases/checkIfEmailExists";
import { futurePaymentSetupController } from "../../application/futurePaymentSetup";
import { middleware } from "../../../../shared/middleware";
import { updatePasswordWithoutCodeController } from "../../useCases/updatePasswordWithoutCode";
import { exportCustomerActionsController } from "../../services/exportCustomerActions";
import { sendUpdateEmailEmailController } from "../../useCases/sendUpdateEmailEmail";
import { exportAllCustomersActionsController } from "../../services/exportAllCustomersActions";
import { Permission } from "../../../../bounded_contexts/IAM/domain/permission/Permission";
import { deleteCustomerSubscriptionsAndOrdersController } from "../../useCases/deleteCustomerSubscriptionsAndOrders";
import { createWalletController } from "../../useCases/createWallet";
import { updateWalletController } from "../../useCases/updateWallet";
import { chargeMoneyToWalletController } from "../../useCases/chargeMoneyToWallet";

const customerRouter = express.Router();

// // GETs
customerRouter.get("/", middleware.ensureAdminAuthenticated([]), (req, res) => getCustomerListController.execute(req, res));
customerRouter.get("/by-name/:name", (req, res) => getCustomerByNameController.execute(req, res));
customerRouter.get("/export", middleware.ensureAdminAuthenticated([Permission.EXPORT_CUSTOMERS]), (req, res) =>
    exportCustomersController.execute(req, res)
);
customerRouter.get("/export-actions/:customerId", middleware.ensureAdminAuthenticated([Permission.EXPORT_CUSTOMERS]), (req, res) =>
    exportCustomerActionsController.execute(req, res)
);
customerRouter.get("/export-actions", middleware.ensureAdminAuthenticated([Permission.EXPORT_CUSTOMERS]), (req, res) =>
    exportAllCustomersActionsController.execute(req, res)
);
customerRouter.get("/:id", (req, res) => getCustomerByIdController.execute(req, res));
customerRouter.get("/information-as-admin/:id", middleware.ensureAdminAuthenticated([Permission.VIEW_CUSTOMER]), (req, res) =>
    getCustomerInformationAsAdminController.execute(req, res)
);

// // PUT
customerRouter.put("/forgot-password/:email", (req, res) => forgotPasswordController.execute(req, res));
customerRouter.put("/reset-password/:email", (req, res) => updatePasswordController.execute(req, res));
customerRouter.put("/change-password/:email", middleware.ensureAuthenticated(), (req, res) =>
    updatePasswordWithoutCodeController.execute(req, res)
);
customerRouter.put("/update/:id", (req, res) => updateCustomerController.execute(req, res));
// customerRouter.put("/update-customer/:id", (req, res) => updateCustomerController.execute(req, res));
customerRouter.put("/update-email", (req, res) => updateCustomerEmailController.execute(req, res));
customerRouter.put("/update-shipping/:id", middleware.ensureAuthenticated(), (req, res) =>
    updateShippingCustomerController.execute(req, res)
);
customerRouter.put("/update-billing/:id", middleware.ensureAuthenticated(), (req, res) =>
    updateCustomerBillingController.execute(req, res)
);
customerRouter.put("/update-info/:id", (req, res) => updateCustomerInfoController.execute(req, res));
customerRouter.put("/update-payment/:id", middleware.ensureAuthenticated(), (req, res) => updatePaymentMethodController.execute(req, res));
customerRouter.put("/add-payment-method/:id", middleware.ensureAuthenticated(), (req, res) => addPaymentMethodController.execute(req, res));
customerRouter.put("/delete/:id", middleware.ensureAdminAuthenticated([Permission.DELETE_CUSTOMER]), (req, res) =>
    deleteCustomerController.execute(req, res)
);
customerRouter.put("/wallet/charge/:customerId", (req, res) => chargeMoneyToWalletController.execute(req, res));
customerRouter.put("/wallet/:customerId", (req, res) => updateWalletController.execute(req, res));


// // POSTs
customerRouter.post("/sign-up", (req, res) => signUpController.execute(req, res));
customerRouter.post("/create", (req, res) => createCustomerByAdminController.execute(req, res));
customerRouter.post("/sign-in", (req, res) => signInController.execute(req, res));
customerRouter.post("/validation/:code", (req, res) => codeValidationController.execute(req, res));
customerRouter.post("/social-auth/:token", (req, res) => socialNetworkAuthController.execute(req, res));
customerRouter.post("/setup-future-payment-method/:id", (req, res) => futurePaymentSetupController.execute(req, res));
customerRouter.post("/check-if-email-exists", (req, res) => checkIfEmailExistsController.execute(req, res));
customerRouter.post("/request-email-change/:customerId", (req, res) => sendUpdateEmailEmailController.execute(req, res));
customerRouter.post("/wallet/:customerId", (req, res) => createWalletController.execute(req, res));

// DELETEs
customerRouter.delete("/subscriptions/:id", (req, res) => deleteCustomerSubscriptionsAndOrdersController.execute(req, res))

export { customerRouter as customerRouter };
