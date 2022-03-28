import express from "express";
import { exportSubscriptionsController } from "../../services/exportSubscriptions";
import { applyCouponToSubscriptionController } from "../../useCases/applyCouponToSubscription";
import { cancelASubscriptionController } from "../../useCases/cancelASubscription";
import { createManySubscriptionsController } from "../../useCases/createManySubscriptions";
import { createSubscriptionController } from "../../useCases/createSubscription";
import { exportCancellationsController } from "../../useCases/exportCancellations";
import { getCustomerSusbcriptionsController } from "../../useCases/getCustomerSubscriptions";
import { getSubscriptionByIdController } from "../../useCases/getSubscriptionById";
import { getSubscriptionByIdAsAdminController } from "../../useCases/getSubscriptionByIdAsAdmin";
import { getSubscriptionListController } from "../../useCases/getSubscriptionList";
import { handle3dSecureFailureController } from "../../useCases/handle3dSecureFailure";
import { handle3dSecureFailureForManySubscriptionsController } from "../../useCases/handle3dSecureFailureForManySubscriptions";
import { reorderPlanController } from "../../useCases/reorderPlan";
import { sendNewSubscriptionEmailController } from "../../useCases/sendNewSubscriptionEmail";
import { swapSubscriptionPlanController } from "../../useCases/swapSubscriptionPlan";
import { updateSubscriptionRestrictionController } from "../../useCases/updateSusbcriptionRestriction";
import { middleware } from "../../../../shared/middleware";
import { createSubscriptionAsAdminController } from "../../useCases/createSubscriptionAsAdmin";
import { deleteSubscriptionController } from "../../useCases/deleteSubscription";
import { updateSubscriptionCouponController } from "../../useCases/updateSubscriptionCoupon";
import { Permission } from "../../../../bounded_contexts/IAM/domain/permission/Permission";

const subscriptionRouter = express.Router();

// GETs
subscriptionRouter.get("/", middleware.ensureAdminAuthenticated([Permission.VIEW_SUBSCRIPTION]), (req, res) =>
    getSubscriptionListController.execute(req, res)
);
subscriptionRouter.get("/information-as-admin/:id", middleware.ensureAdminAuthenticated([Permission.VIEW_SUBSCRIPTION]), (req, res) =>
    getSubscriptionByIdAsAdminController.execute(req, res)
);
subscriptionRouter.get("/by-customer/:customerId", middleware.ensureAuthenticated(), (req, res) =>
    getCustomerSusbcriptionsController.execute(req, res)
);
subscriptionRouter.get("/export", middleware.ensureAdminAuthenticated([Permission.EXPORT_SUBSCRIPTIONS]), (req, res) =>
    exportSubscriptionsController.execute(req, res)
);
subscriptionRouter.get("/export-cancellations", middleware.ensureAdminAuthenticated([Permission.EXPORT_CANCELLATIONS]), (req, res) =>
    exportCancellationsController.execute(req, res)
);
subscriptionRouter.get("/:id", middleware.ensureAuthenticated(), (req, res) => getSubscriptionByIdController.execute(req, res));

// POSTs
subscriptionRouter.post("/", (req, res) => createSubscriptionController.execute(req, res));
subscriptionRouter.post("/many", (req, res) => createManySubscriptionsController.execute(req, res));
subscriptionRouter.post("/as-admin", middleware.ensureAdminAuthenticated([Permission.CREATE_SUBSCRIPTION]), (req, res) =>
    createSubscriptionAsAdminController.execute(req, res)
);
subscriptionRouter.post("/reorder/:subscriptionId", middleware.ensureAuthenticated(), (req, res) =>
    reorderPlanController.execute(req, res)
);
subscriptionRouter.post("/notify-new-subscription/:subscriptionId", (req, res) => sendNewSubscriptionEmailController.execute(req, res));

// PUTs
subscriptionRouter.put("/cancel/:id", middleware.ensureAuthenticated(), (req, res) => cancelASubscriptionController.execute(req, res));
subscriptionRouter.put("/swap-plan/:id", middleware.ensureAuthenticated(), (req, res) => swapSubscriptionPlanController.execute(req, res));
subscriptionRouter.put("/update-restriction/:id", middleware.ensureAuthenticated(), (req, res) =>
    updateSubscriptionRestrictionController.execute(req, res)
);
subscriptionRouter.put("/handle-3dsecure-failure/:id", middleware.ensureAuthenticated(), (req, res) =>
    handle3dSecureFailureController.execute(req, res)
);
subscriptionRouter.put("/handle-3dsecure-failure-for-many-subscriptions", middleware.ensureAuthenticated(), (req, res) =>
    handle3dSecureFailureForManySubscriptionsController.execute(req, res)
);
subscriptionRouter.put("/apply-coupon/:id", (req, res) => applyCouponToSubscriptionController.execute(req, res));
subscriptionRouter.put("/update-coupon/:id", middleware.ensureAdminAuthenticated([Permission.UPDATE_SUBSCRIPTION]), (req, res) =>
    updateSubscriptionCouponController.execute(req, res)
);

// DELETEs
subscriptionRouter.delete("/:id", middleware.ensureAdminAuthenticated([Permission.DELETE_SUBSCRIPTION]), (req, res) =>
    deleteSubscriptionController.execute(req, res)
);

export { subscriptionRouter };
