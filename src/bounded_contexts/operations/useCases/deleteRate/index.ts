import { mongooseRateRepository } from "../../infra/repositories/rate";
import { DeleteRate } from "./deleteRate";
import { DeleteRateController } from "./deleteRateController";

export const deleteRate: DeleteRate = new DeleteRate(mongooseRateRepository);
export const deleteRateController: DeleteRateController = new DeleteRateController(deleteRate);
