import { mongooseShippingZoneRepository } from "../../infra/repositories/shipping";
import { DeleteShippingZone } from "./deleteShippingZone";
import { DeleteShippingZoneController } from "./deleteShippingZoneController";

// export const deletePlan: DeletePlan = new DeletePlan(mockPlanRepository);
export const deleteShippingZone: DeleteShippingZone = new DeleteShippingZone(mongooseShippingZoneRepository);
export const deleteShippingZoneController: DeleteShippingZoneController = new DeleteShippingZoneController(deleteShippingZone);
