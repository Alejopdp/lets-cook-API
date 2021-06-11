import { mongooseRoleRepository } from "../src/bounded_contexts/IAM/infra/repositories/role";
import { mongooseUserRepository } from "../src/bounded_contexts/IAM/infra/repositories/user";
import { restoreDb } from "../src/config/config";
import { adminRole } from "./role";
import { adminUser1, adminUser2 } from "./user";

export const loadMockData = async () => {
    await mongooseRoleRepository.save(adminRole);
    await mongooseUserRepository.save(adminUser1);
    await mongooseUserRepository.save(adminUser2);
};
