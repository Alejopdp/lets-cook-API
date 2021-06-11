import { logger } from "../config";
import { mongooseRoleRepository } from "../src/bounded_contexts/IAM/infra/repositories/role";
import { mongooseUserRepository } from "../src/bounded_contexts/IAM/infra/repositories/user";
import { mongooseIngredientRepository } from "../src/bounded_contexts/operations/infra/repositories/ingredient";
import { mongoosePlanRepository } from "../src/bounded_contexts/operations/infra/repositories/plan";
import { mongooseRecipeRepository } from "../src/bounded_contexts/operations/infra/repositories/recipe";
import { mongooseWeekRepository } from "../src/bounded_contexts/operations/infra/repositories/week";
import { getIngredients } from "./ingredient";
import { getMockPlans } from "./plan";
import { getMockRecipes } from "./recipe";
import { adminRole } from "./role";
import { adminUser1, adminUser2 } from "./user";
import { getArrayOfFutureWeeks } from "./week";

export const loadMockData = async () => {
    await mongooseRoleRepository.save(adminRole);
    logger.info("Roles loaded");
    await mongooseUserRepository.save(adminUser1);
    await mongooseUserRepository.save(adminUser2);
    logger.info("Users loaded");
    await mongooseWeekRepository.bulkSave(getArrayOfFutureWeeks());
    logger.info("Weeks loaded");
    await mongooseIngredientRepository.bulkSave(getIngredients());
    logger.info("Ingredients loaded");
    await mongoosePlanRepository.bulkSave(getMockPlans());
    logger.info("Plans loaded");
    await mongooseRecipeRepository.bulkSave(await getMockRecipes());
    logger.info("Recipes loaded");
};
