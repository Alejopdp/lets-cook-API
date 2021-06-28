import { DeleteRecipeRating } from "./deleteRecipeRating"
import { DeleteRecipeRatingController } from "./deleteRecipeRatingController"

export const deleteRecipeRating: DeleteRecipeRating = new DeleteRecipeRating()
export const deleteRecipeRatingController: DeleteRecipeRatingController = new DeleteRecipeRatingController(deleteRecipeRating)