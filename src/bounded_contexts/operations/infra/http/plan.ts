import express from "express";
import multer from "multer";
import { createPlanController } from "../../useCases/createPlan";
import { deletePlanController } from "../../useCases/deletePlan";
import { getAdditionalPlanListController } from "../../useCases/getAdditionalPlanList";
import { getPlanByIdController } from "../../useCases/getPlanById";
import { getPlanListController } from "../../useCases/getPlanList";
import { togglePlanStateController } from "../../useCases/togglePlanState";
import { updatePlanController } from "../../useCases/updatePlan";
import { getAdditionalPlansByPlanIdController } from "../../useCases/getAdditionalPlansByPlanId";
import { getPlanVariantsRecipesByWeekListController } from "../../useCases/getPlanVariantsRecipesByWeek";
import { getDataForSwappingAPlanController } from "../../useCases/getDataForSwappingAPlan";
import { getPlanAhorroController } from "../../useCases/getPlanAhorro";
import { Permission } from "../../../../bounded_contexts/IAM/domain/permission/Permission";
import { middleware } from "../../../../shared/middleware";

const planRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// GETs
planRouter.get("/", (req, res) => getPlanListController.execute(req, res));
planRouter.get("/additionals", (req, res) => getAdditionalPlanListController.execute(req, res));
planRouter.get("/additionals/:id", (req, res) => getAdditionalPlansByPlanIdController.execute(req, res));
planRouter.get("/plans/week", middleware.addCurrentUser(true), (req, res) => getPlanVariantsRecipesByWeekListController.execute(req, res));
planRouter.get("/data-for-swapping/:subscriptionId", (req, res) => getDataForSwappingAPlanController.execute(req, res));
planRouter.get("/ahorro", (req, res) => getPlanAhorroController.execute(req, res));
planRouter.get("/:id", (req, res) => getPlanByIdController.execute(req, res));

// PUT
planRouter.put("/toggle-state/:id", middleware.ensureAdminAuthenticated([Permission.UPDATE_PLAN]), (req, res) =>
    togglePlanStateController.execute(req, res)
);
planRouter.put(
    "/:id",
    [multer(options).single("planImage"), middleware.ensureAdminAuthenticated([Permission.UPDATE_PLAN])],
    (req: any, res: any) => updatePlanController.execute(req, res)
);

// POSTs
planRouter.post(
    "/",
    [
        multer(options).fields([
            { name: "planImage", maxCount: 1 },
            { name: "icon", maxCount: 1 },
            { name: "iconWithColor", maxCount: 1 },
        ]),
        middleware.ensureAdminAuthenticated([Permission.CREATE_PLAN]),
    ],
    (req: any, res: any) => createPlanController.execute(req, res)
);

// DELETEs
planRouter.delete("/:id", middleware.ensureAdminAuthenticated([Permission.DELETE_PLAN]), (req, res) =>
    deletePlanController.execute(req, res)
);

export { planRouter };
