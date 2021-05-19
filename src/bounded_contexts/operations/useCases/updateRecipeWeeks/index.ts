import { mockRecipeRepository } from "../../infra/repositories/recipe";
import { mockWeekRepository } from "../../infra/repositories/week";
import { UpdateRecipeWeeks } from "./updateRecipeWeeks";
import { UpdateRecipeWeeksController } from "./updateRecipeWeeksController";

export const updateRecipeWeeks: UpdateRecipeWeeks = new UpdateRecipeWeeks(mockRecipeRepository, mockWeekRepository);
export const updateRecipeWeeksController: UpdateRecipeWeeksController = new UpdateRecipeWeeksController(updateRecipeWeeks);
