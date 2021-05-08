import { mongooseRoleRepository } from "../src/bounded_contexts/IAM/infra/repositories/role";
import { restoreDb } from "../src/config/config";
import { adminRole } from "./role";

const loadMockData = async () => {
    await mongooseRoleRepository.save(adminRole);
};
