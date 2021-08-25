// To run from root, execute the following:
// npx ts-node scripts/shopifyMigration/migrate.ts
import { Customer } from "../../src/bounded_contexts/operations/domain/customer/Customer";
// import { Order } from "../../src/bounded_contexts/operations/domain/order/Order";
// import { OrderStateFactory } from "../../src/bounded_contexts/operations/domain/order/orderState/OrderStateFactory";
// import { Plan } from "../../src/bounded_contexts/operations/domain/plan/Plan";
// import { PlanVariantId } from "../../src/bounded_contexts/operations/domain/plan/PlanVariant/PlanVariantId";
// import { Week } from "../../src/bounded_contexts/operations/domain/week/Week";
import { ICustomerRepository } from "../../src/bounded_contexts/operations/infra/repositories/customer/ICustomerRepository";
import { MongooseCustomerRepository } from "../../src/bounded_contexts/operations/infra/repositories/customer/mongooseCustomerRepository";
import { connectToDatabase } from "../../src/infraestructure/mongoose/config/config";
// import { IOrderRepository } from "../../src/bounded_contexts/operations/infra/repositories/order/IOrderRepository";
// import { MongooseOrderRepository } from "../../src/bounded_contexts/operations/infra/repositories/order/mongooseOrderRepository";
// import { RequestInfo } from "node-fetch";
// Recharge api token: 	fca35e686341f59f50c3222d61ef0d645a09c7434f4ee93aea04127169b043f5
// Recharge API: https://api.rechargeapps.com/{resource}

async function fetchRechargeEntityCollection(entityCollectionName: string): Promise<any[]> {

    const fetch = require('node-fetch');

    let request = fetch(
        `https://api.rechargeapps.com/${entityCollectionName}`, {
            method: 'GET',
            headers: { "X-Recharge-Access-Token" : "fca35e686341f59f50c3222d61ef0d645a09c7434f4ee93aea04127169b043f5" }
        }
    );
    let response = await request;
    let value = await response.json();
    let result: any[] = value[entityCollectionName];
    return result;

}

async function fetchShopifyEntityCollection(entityCollectionName: string): Promise<any[]> {

    const fetch = require('node-fetch');

    let request = fetch(`https://87700134e27c0aca518cb36d356c837b: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@bon-chef-recetas-ingredientes.myshopify.com/admin/api/2021-07/${entityCollectionName}.json`)
    let response = await request;
    let value = await response.json();
    let result: any[] = value[entityCollectionName];
    return result;

}

async function migrateCustomers() {

    // let results = await fetchRechargeEntityCollection("subscriptions");
    // console.log(results);

    let temp = await fetchRechargeEntityCollection("charges");
    console.log(temp);

    // Fetching customers
    // let customers: any[] = await fetchShopifyEntityCollection('customers');

    // // Instantiating repository to save customers
    // let customerRepository: ICustomerRepository = new MongooseCustomerRepository();

    // // Mapping and saving each customer
    // customers.forEach(async shopifyCustomer => {
    //     // Map
    //     let letsCookCustomer = Customer.create(
    //         shopifyCustomer.email,
    //         true,
    //         "123",
    //         [],
    //         undefined,undefined,undefined, "active"
    //     )

    //     // Save
    //     await customerRepository.save(letsCookCustomer);
    // });
}

async function migrateOrders() {

    // Fetching orders
    let orders: any[] = await fetchShopifyEntityCollection('orders');

    // Instantiating repository to save customers
    // let orderRepository: IOrderRepository = new MongooseOrderRepository();

    // Mapping and saving each customer
    orders.forEach(async shopifyOrder => {
        // Map
        // let letsCookOrder = new Order(
        //     Date.now(), // ¿Cómo queremos manejar las fechas de las órdenes importadas?
        //     OrderStateFactory.createState('ORDER_ACTIVE'),
        //     Date.now(), // ¿Cómo queremos manejar las fechas de las órdenes importadas?
        //     Week.create(Date.now(), Date.now()),
        //     new PlanVariantId(""),
        //     null,0
        // )
        
        // Save
        // await orderRepository.save(letsCookOrder);
    });
}

async function migrate() {
    process.env.NODE_ENV = 'shopify-migration-tests';
    await connectToDatabase();

    // En teoría acá sólo debería haber aggregate roots.
    await Promise.all([
        migrateCustomers()
        // migrateOrders()
    ]);
}

migrate();