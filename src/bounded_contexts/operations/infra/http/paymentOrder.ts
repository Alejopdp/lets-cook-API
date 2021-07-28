import express from "express";
import { createSubscriptionController } from "../../useCases/createSubscription";
import { getCustomerPaymentOrdersController } from "../../useCases/getCustomerPaymentOrders";
import { getPaymentOrderByIdController } from "../../useCases/getPaymentOrderById";
import { getPaymentOrdersAsAdminController } from "../../useCases/getPaymentOrdersAsAdmin";

const paymentOrderRouter = express.Router();

// GETs
paymentOrderRouter.get("/", (req, res) => getPaymentOrdersAsAdminController.execute(req, res));
paymentOrderRouter.get("/by-customer/:customerId", (req, res) => getCustomerPaymentOrdersController.execute(req, res));
paymentOrderRouter.get("/:id", (req, res) => getPaymentOrderByIdController.execute(req, res));

// POSTs
paymentOrderRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));

// DELETEs

export { paymentOrderRouter };
