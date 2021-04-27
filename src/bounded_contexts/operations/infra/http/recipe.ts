import express from "express";
import multer from "multer";
import { createRecipeController } from "../../useCases/createRecipe";
import { getDataForCreatingARecipeController } from "../../useCases/getDataForCreatingARecipe";
import { getRecipeListController } from "../../useCases/getRecipeList";
import { updateRecipeController } from "../../useCases/updateRecipe";

const recipeRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// GETs
recipeRouter.get("/", (req, res) => getRecipeListController.execute(req, res));
recipeRouter.get("/get-data-for-creation", (req, res) => getDataForCreatingARecipeController.execute(req, res));

// POSTs
recipeRouter.post("/", multer(options).single("recipeImage"), (req, res) => createRecipeController.execute(req, res));

// PUTs
recipeRouter.put("/:id", multer(options).single("recipeImage"), (req, res) => updateRecipeController.execute(req, res));

export { recipeRouter };
