import express from "express";
import multer from "multer";
import { deleteRecipeRatingController } from "../../useCases/deleteRecipeRating";
import { getRecipeByIdController } from "../../useCases/getRecipeById";
import { getRecipeRatingsByCustomerController } from "../../useCases/getRecipeRatingsByCustomer";
import { rateRecipeController } from "../../useCases/rateRecipe";

const recipeRatingRouter = express.Router();

const options: multer.Options = {
    dest: "/tmp",
};

// GETs
recipeRatingRouter.get("/by-customer/:customerId", (req, res) => getRecipeRatingsByCustomerController.execute(req, res));
recipeRatingRouter.get("/:id", (req, res) => getRecipeByIdController.execute(req, res));

// POSTs
// recipeRatingRouter.post("/", multer(options).single("recipeImage"), (req, res) => createRecipeController.execute(req, res));

// PUTs
recipeRatingRouter.put("/rate/:id", (req, res) => rateRecipeController.execute(req, res));
// recipeRatingRouter.put("/:id", multer(options).single("recipeImage"), (req, res) => updateRecipeController.execute(req, res));

// DELETEs
recipeRatingRouter.delete("/:id", (req, res) => deleteRecipeRatingController.execute(req, res));

export { recipeRatingRouter };
