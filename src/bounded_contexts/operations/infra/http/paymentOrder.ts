import express from "express";
import { chargeOnePaymentOrderController } from "../../useCases/chargeOnePaymentOrder";
import { createSubscriptionController } from "../../useCases/createSubscription";
import { getCustomerPaymentOrdersController } from "../../useCases/getCustomerPaymentOrders";
import { getPaymentOrderByIdController } from "../../useCases/getPaymentOrderById";
import { getPaymentOrdersAsAdminController } from "../../useCases/getPaymentOrdersAsAdmin";
import { refundPaymentOrderController } from "../../useCases/refundPaymentOrder.ts";
import { updatePaymentOrderAndOrdersStateController } from "../../useCases/updatePaymentOrderAndOrdersState";
import { UpdatePaymentOrderAndOrdersStateController } from "../../useCases/updatePaymentOrderAndOrdersState/updatePaymentOrderAndOrdersStateController";

const paymentOrderRouter = express.Router();

// GETs
paymentOrderRouter.get("/", (req, res) => getPaymentOrdersAsAdminController.execute(req, res));
paymentOrderRouter.get("/by-customer/:customerId", (req, res) => getCustomerPaymentOrdersController.execute(req, res));
paymentOrderRouter.get("/:id", (req, res) => getPaymentOrderByIdController.execute(req, res));

// POSTs
paymentOrderRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));

// PUTs
paymentOrderRouter.put("/charge/:id", (req, res) => chargeOnePaymentOrderController.execute(req, res));
paymentOrderRouter.put("/update-state/:id", (req, res) => updatePaymentOrderAndOrdersStateController.execute(req, res));
paymentOrderRouter.put("/refund/:id", (req, res) => refundPaymentOrderController.execute(req, res));

// DELETEs

export { paymentOrderRouter };
