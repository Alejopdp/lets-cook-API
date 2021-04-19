import express from "express";
import { createRoleController } from "../../useCases/createRole";
import { getRoleListController } from "../../useCases/getRoleList";

const roleRouter = express.Router();

// GETs
roleRouter.get("/", (req, res) => getRoleListController.execute(req, res));

// POSTs
roleRouter.post("/", (req, res) => createRoleController.execute(req, res));

export { roleRouter };
