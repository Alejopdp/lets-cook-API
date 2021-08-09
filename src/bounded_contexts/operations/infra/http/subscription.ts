import express from "express";
import { cancelASubscriptionController } from "../../useCases/cancelASubscription";
import { createManySubscriptionsController } from "../../useCases/createManySubscriptions";
import { createSubscriptionController } from "../../useCases/createSubscription";
import { getCustomerSusbcriptionsController } from "../../useCases/getCustomerSubscriptions";
import { getSubscriptionByIdController } from "../../useCases/getSubscriptionById";
import { getSubscriptionByIdAsAdminController } from "../../useCases/getSubscriptionByIdAsAdmin";
import { getSubscriptionListController } from "../../useCases/getSubscriptionList";
import { handle3dSecureFailureController } from "../../useCases/handle3dSecureFailure";
import { handle3dSecureFailureForManySubscriptionsController } from "../../useCases/handle3dSecureFailureForManySubscriptions";
import { reorderPlanController } from "../../useCases/reorderPlan";
import { swapSubscriptionPlanController } from "../../useCases/swapSubscriptionPlan";
import { updateSubscriptionRestrictionController } from "../../useCases/updateSusbcriptionRestriction";

const subscriptionRouter = express.Router();

// GETs
subscriptionRouter.get("/", (req, res) => getSubscriptionListController.execute(req, res));
subscriptionRouter.get("/information-as-admin/:id", (req, res) => getSubscriptionByIdAsAdminController.execute(req, res));
subscriptionRouter.get("/by-customer/:customerId", (req, res) => getCustomerSusbcriptionsController.execute(req, res));
subscriptionRouter.get("/:id", (req, res) => getSubscriptionByIdController.execute(req, res));

// POSTs
subscriptionRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));
subscriptionRouter.post("/many", (req, res) => createManySubscriptionsController.execute(req, res));
subscriptionRouter.post("/reorder/:subscriptionId", (req, res) => reorderPlanController.execute(req, res));

// PUTs
subscriptionRouter.put("/cancel/:id", (req, res) => cancelASubscriptionController.execute(req, res));
subscriptionRouter.put("/swap-plan/:id", (req, res) => swapSubscriptionPlanController.execute(req, res));
subscriptionRouter.put("/update-restriction/:id", (req, res) => updateSubscriptionRestrictionController.execute(req, res));
subscriptionRouter.put("/handle-3dsecure-failure/:id", (req, res) => handle3dSecureFailureController.execute(req, res));
subscriptionRouter.put("/handle-3dsecure-failure-for-many-subscriptions", (req, res) =>
    handle3dSecureFailureForManySubscriptionsController.execute(req, res)
);

// DELETEs

export { subscriptionRouter };
