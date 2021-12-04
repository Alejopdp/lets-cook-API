import express from "express";
import multer from "multer";
import { middleware } from "../../../../shared/middleware";
import { createRecipeController } from "../../useCases/createRecipe";
import { deleteRecipeController } from "../../useCases/deleteRecipe";
import { getDataForCreatingARecipeController } from "../../useCases/getDataForCreatingARecipe";
import { getRecipeByIdController } from "../../useCases/getRecipeById";
import { getRecipesByRestrictionsController } from "../../useCases/getRecipesByRestrictionsAndPlan";
import { getRecipeFiltersController } from "../../useCases/getRecipeFilters";
import { getRecipeListController } from "../../useCases/getRecipeList";
import { updateRecipeController } from "../../useCases/updateRecipe";
import { updateRecipeWeeksController } from "../../useCases/updateRecipeWeeks";
import { getRecipesForOrderController } from "../../useCases/getRecipesForOrder";
import { getNextWeekRecipesController } from "../../useCases/getNextWeekRecipes";
import { deleteRecipeVariantController } from "../../useCases/deleteRecipeVariant";

const recipeRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// GETs
recipeRouter.get("/", (req, res) => getRecipeListController.execute(req, res));
recipeRouter.get("/get-data-for-creation", (req, res) => getDataForCreatingARecipeController.execute(req, res));
recipeRouter.get("/for-order/:orderId", (req, res) => getRecipesForOrderController.execute(req, res));
recipeRouter.get("/filters", (req, res) => getRecipeFiltersController.execute(req, res));
recipeRouter.get("/next-week", (req, res) => getNextWeekRecipesController.execute(req, res));
recipeRouter.get("/:id", (req, res) => getRecipeByIdController.execute(req, res));
recipeRouter.get("/recipes-list/by-restrictions", (req, res) => getRecipesByRestrictionsController.execute(req, res));

// POSTs
recipeRouter.post("/", multer(options).array("recipeImages"), (req, res) => createRecipeController.execute(req, res));

// PUTs
recipeRouter.put("/update-weeks/:id", (req, res) => updateRecipeWeeksController.execute(req, res));
recipeRouter.put("/delete-variant/:variantSku", (req, res) => deleteRecipeVariantController.execute(req, res));
recipeRouter.put("/:id", multer(options).array("recipeImages"), (req, res) => updateRecipeController.execute(req, res));

// DELETEs
recipeRouter.delete("/:id", (req, res) => deleteRecipeController.execute(req, res));

export { recipeRouter };
