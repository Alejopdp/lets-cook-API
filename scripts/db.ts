import { logger } from "../config";
import { mongooseRoleRepository } from "../src/bounded_contexts/IAM/infra/repositories/role";
import { mongooseUserRepository } from "../src/bounded_contexts/IAM/infra/repositories/user";
import { mongooseIngredientRepository } from "../src/bounded_contexts/operations/infra/repositories/ingredient";
import { mongoosePlanRepository } from "../src/bounded_contexts/operations/infra/repositories/plan";
import { mongooseRecipeRepository } from "../src/bounded_contexts/operations/infra/repositories/recipe";
import { mongooseRecipeVariantRestrictionRepository } from "../src/bounded_contexts/operations/infra/repositories/recipeVariantRestriction";
import { mongooseShippingZoneRepository } from "../src/bounded_contexts/operations/infra/repositories/shipping";
import { mongooseWeekRepository } from "../src/bounded_contexts/operations/infra/repositories/week";
import { getIngredients, saveIngredients } from "./ingredient";
import { getMockPlans } from "./plan";
import { getMockRecipes, uploadProdRecipes } from "./recipe";
import { getMockRecipeVartiantRestrictions } from "./recipeVariantRestriction";
import { adminRole } from "./role";
import { shippingZones } from "./shippingZones";
import { adminUser1, adminUser2 } from "./user";
import { getArrayOfFutureWeeks } from "./week";

export const loadMockData = async () => {
    // await mongooseRoleRepository.save(adminRole);
    // logger.info("Roles loaded");
    // await mongooseUserRepository.save(adminUser1);
    // await mongooseUserRepository.save(adminUser2);
    // logger.info("Users loaded");
    // await mongooseWeekRepository.bulkSave(getArrayOfFutureWeeks());
    // logger.info("Weeks loaded");
    // await saveIngredients();
    // logger.info("Ingredients loaded");
    // await mongoosePlanRepository.bulkSave(getMockPlans());
    // logger.info("Plans loaded");
    // await mongooseRecipeVariantRestrictionRepository.bulkSave(getMockRecipeVartiantRestrictions());
    // logger.info("Restrictiones loaded");
    // const mockRecipes = await getMockRecipes();
    // await mongooseRecipeRepository.bulkSave(mockRecipes);
    // logger.info("Recipes loaded");
    // await mongooseShippingZoneRepository.saveBulk(shippingZones);
    // logger.info("Shipping zones loaded");
    await uploadProdRecipes();
};
