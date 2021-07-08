import express from "express";
import { createSubscriptionController } from "../../useCases/createSubscription";
import { getCustomerPaymentOrdersController } from "../../useCases/getCustomerPaymentOrders";
import { getPaymentOrderByIdController } from "../../useCases/getPaymentOrderById";

const paymentOrderRouter = express.Router();

// GETs
paymentOrderRouter.get("/", (req, res) => res.json({}));
paymentOrderRouter.get("/by-customer/:customerId", (req, res) => getCustomerPaymentOrdersController.execute(req, res));
paymentOrderRouter.get("/:id", (req, res) => getPaymentOrderByIdController.execute(req, res));

// POSTs
paymentOrderRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));

// DELETEs

export { paymentOrderRouter };
