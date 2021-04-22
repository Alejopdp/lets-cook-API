import { Plan } from "../../../domain/plan/Plan";
import { IPlanRepository } from "./IPlanRepository";
import { MockPlanRepository } from "./mockPlanRepository";

const mockDatabase: Plan[] = [];
export const mockPlanRepository: IPlanRepository = new MockPlanRepository(mockDatabase);
