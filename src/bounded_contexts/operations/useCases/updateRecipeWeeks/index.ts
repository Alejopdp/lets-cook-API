import { mongooseRecipeRepository } from "../../infra/repositories/recipe";
import { mongooseWeekRepository } from "../../infra/repositories/week";
import { UpdateRecipeWeeks } from "./updateRecipeWeeks";
import { UpdateRecipeWeeksController } from "./updateRecipeWeeksController";

export const updateRecipeWeeks: UpdateRecipeWeeks = new UpdateRecipeWeeks(mongooseRecipeRepository, mongooseWeekRepository);
export const updateRecipeWeeksController: UpdateRecipeWeeksController = new UpdateRecipeWeeksController(updateRecipeWeeks);
