import { Locale } from "../src/bounded_contexts/operations/domain/locale/Locale";
import { Subscription } from "../src/bounded_contexts/operations/domain/subscription/Subscription";
import { mongooseOrderRepository } from "../src/bounded_contexts/operations/infra/repositories/order";
import { mongooseSubscriptionRepository } from "../src/bounded_contexts/operations/infra/repositories/subscription";
import { connectToDatabase } from "../src/infraestructure/mongoose/config/config";

export const addCustomerToOrders = async () => {
    await connectToDatabase();
    const subscriptions: Subscription[] = await mongooseSubscriptionRepository.findAll(Locale.es);

    console.log("Updating orders...");
    for (let sub of subscriptions) {
        await mongooseOrderRepository.addCustomerToOrderOfSubscription(sub.id, sub.customer.id);
    }

    console.info("Orders updated correctly");
};

addCustomerToOrders();
