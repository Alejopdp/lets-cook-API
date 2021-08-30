// To run from root, execute the following:
// npm exec ts-node scripts/shopifyMigration/migrate.ts

import Stripe from "stripe";
import { stripeService } from "../../src/bounded_contexts/operations/application/paymentService";
import { Customer } from "../../src/bounded_contexts/operations/domain/customer/Customer";
import { PaymentMethod } from "../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod";
import { ICustomerRepository } from "../../src/bounded_contexts/operations/infra/repositories/customer/ICustomerRepository";
import { MongooseCustomerRepository } from "../../src/bounded_contexts/operations/infra/repositories/customer/mongooseCustomerRepository";
import { connectToDatabase } from "../../src/infraestructure/mongoose/config/config";

const stripeConfig: Stripe.StripeConfig = {
    apiVersion: "2020-08-27",
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, stripeConfig);

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
    let linkHeader: string = response.headers.get("Link");
    // console.log(linkHeader.substr(1, linkHeader.lastIndexOf(">") - 1));
    

    let result: any[] = value[entityCollectionName];
    return result;

}

async function migrateCustomers() {

    console.info("Customers migration is starting.");

    let shopifyCustomers: any[];
    let rechargeCustomers: any[];

    // await Promise.all([
    //     async () => {shopifyCustomers = await fetchShopifyEntityCollection('customers');},
    //     async () => {rechargeCustomers = await fetchRechargeEntityCollection('customers');}
    // ])

    shopifyCustomers = await fetchShopifyEntityCollection('customers');
    rechargeCustomers = await fetchRechargeEntityCollection('customers');

    // Instantiating repository to save customers
    let customerRepository: ICustomerRepository = new MongooseCustomerRepository();

    // Mapping and saving each customer
    //@ts-ignore false positive
    shopifyCustomers.forEach(async shopifyCustomer => {

        let existingCustomer = await customerRepository.findByEmail(shopifyCustomer.email);
        
        let rechargeCustomer = rechargeCustomers.find(rc => rc.shopify_customer_id == shopifyCustomer.id);

/*      id: 'pm_1JTVbwH24hlkZqHlxw6yqJVv',
      object: 'payment_method',
      billing_details: [Object],
      card: [Object],
      created: 1630172792,
      customer: 'cus_K7l8XAhU622rSw',
      livemode: true,
      metadata: {},
      type: 'card'*/


        let stripeCustomerPaymentMethods: Stripe.PaymentMethod[] = [];
        let letsCookCustomerPaymentMethods: PaymentMethod[] = [];

        if(rechargeCustomer)
        {
            let stripeCustomer = (await stripe.customers.retrieve(rechargeCustomer.stripe_customer_token));

            console.log(stripeCustomer);


            stripeCustomerPaymentMethods = (await stripe.paymentMethods.list({
                customer: rechargeCustomer.stripe_customer_token,
                type: 'card'
            })).data;

            stripeCustomerPaymentMethods.forEach(pm => {
                if(pm.card)
                    letsCookCustomerPaymentMethods.push(
                        new PaymentMethod(
                            pm.card?.brand,
                            pm.card?.last4,
                            pm.card?.exp_month,
                            pm.card?.exp_year,
                            pm.card?.checks?.cvc_check || "",
                            //@ts-ignore
                            stripeCustomer.invoice_settings && pm.id == stripeCustomer.invoice_settings.default_payment_method,
                            pm.id
                        )
                    );
            });

        }

        console.log(letsCookCustomerPaymentMethods);

        let letsCookCustomer = Customer.create(
            shopifyCustomer.email,
            true,
            rechargeCustomer.stripe_customer_token,
            letsCookCustomerPaymentMethods,
            undefined, // from shopify
            undefined, // from shopify
            undefined, // generate randomly passing restrictions
            "active",
            undefined,
            undefined, // from shopify
            undefined // if possible, create guid with seed from shopify id
        );

        // Save
        // await customerRepository.save(letsCookCustomer);
    });

    console.info("Customers migration has ended.");
    
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

    console.info("All migration methods have ended.");
}

migrate();