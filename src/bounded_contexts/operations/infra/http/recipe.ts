import express from "express";
import multer from "multer";
import { middleware } from "../../../../shared/middleware";
import { createRecipeController } from "../../useCases/createRecipe";
import { deleteRecipeController } from "../../useCases/deleteRecipe";
import { getDataForCreatingARecipeController } from "../../useCases/getDataForCreatingARecipe";
import { getRecipeByIdController } from "../../useCases/getRecipeById";
import { getRecipeFiltersController } from "../../useCases/getRecipeFilters";
import { getRecipeListController } from "../../useCases/getRecipeList";
import { updateRecipeController } from "../../useCases/updateRecipe";
import { updateRecipeWeeksController } from "../../useCases/updateRecipeWeeks";

const recipeRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// GETs
recipeRouter.get("/", (req, res) => getRecipeListController.execute(req, res));
recipeRouter.get("/get-data-for-creation", (req, res) => getDataForCreatingARecipeController.execute(req, res));
recipeRouter.get("/filters", (req, res) => getRecipeFiltersController.execute(req, res));
recipeRouter.get("/:id", (req, res) => getRecipeByIdController.execute(req, res));

// POSTs
recipeRouter.post("/", multer(options).single("recipeImage"), (req, res) => createRecipeController.execute(req, res));

// PUTs
recipeRouter.put("/update-weeks/:id", (req, res) => updateRecipeWeeksController.execute(req, res));
recipeRouter.put("/:id", multer(options).single("recipeImage"), (req, res) => updateRecipeController.execute(req, res));

// DELETEs
recipeRouter.delete("/:id", (req, res) => deleteRecipeController.execute(req, res));

export { recipeRouter };
