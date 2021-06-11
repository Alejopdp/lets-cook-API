import { logger } from "../config";
import { mongooseRoleRepository } from "../src/bounded_contexts/IAM/infra/repositories/role";
import { mongooseUserRepository } from "../src/bounded_contexts/IAM/infra/repositories/user";
import { mongooseWeekRepository } from "../src/bounded_contexts/operations/infra/repositories/week";
import { restoreDb } from "../src/config/config";
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
};
