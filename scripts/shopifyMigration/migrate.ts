// To run from root, execute the following:
// npm exec ts-node scripts/shopifyMigration/migrate.ts

import Stripe from "stripe";
import { UserPassword } from "../../src/bounded_contexts/IAM/domain/user/UserPassword";
import { stripeService } from "../../src/bounded_contexts/operations/application/paymentService";
import { Billing } from "../../src/bounded_contexts/operations/domain/billing/Billing";
import { Customer } from "../../src/bounded_contexts/operations/domain/customer/Customer";
import { PaymentMethod } from "../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod";
import { PersonalInfo } from "../../src/bounded_contexts/operations/domain/customer/personalInfo/PersonalInfo";
import { ICustomerRepository } from "../../src/bounded_contexts/operations/infra/repositories/customer/ICustomerRepository";
import { MongooseCustomerRepository } from "../../src/bounded_contexts/operations/infra/repositories/customer/mongooseCustomerRepository";
import { connectToDatabase } from "../../src/infraestructure/mongoose/config/config";
import { v5 as uuidv5 } from 'uuid';
import { CustomerId } from "../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { Address } from "../../src/bounded_contexts/operations/domain/address/Address";

const LETS_COOK_UUID_NAMESPACE = "DC88F9B6-0C95-4FD8-9123-55ADD55CE468"

const stripeConfig: Stripe.StripeConfig = {
    apiVersion: "2020-08-27",
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, stripeConfig);

async function fetchRechargeEntityCollection(entityCollectionName: string): Promise<any[]> {

    const fetch = require('node-fetch');

    let page = 1;
    let result: any[] = [];
    
    do
    {
        let request = fetch(
            `https://api.rechargeapps.com/${entityCollectionName}?limit=250&page=${page}`, {
            method: 'GET',
            headers: { "X-Recharge-Access-Token": "fca35e686341f59f50c3222d61ef0d645a09c7434f4ee93aea04127169b043f5" }
        });
        let response = await request;
        let value = await response.json();

        let pageEntities = value[entityCollectionName];

        if(!pageEntities.length)
            break;

        result.push(...pageEntities);
        
    } while(++page <= 100)

    return result;
}

function getNextLinkFromResponse(response: any): string | null {
    let linkHeader: string = response.headers.get("Link");

    var rels = linkHeader.split(",");
    var nextRel = rels.find(r => r.indexOf("next") >= 0);

    if(nextRel == undefined)
        return null;

    let nextLinkStartIndex = nextRel.indexOf("<") + 1;
    let nextLinkEndIndex = nextRel.lastIndexOf(">");
    let nextLink = nextRel.substr(nextLinkStartIndex, nextLinkEndIndex - nextLinkStartIndex);

    let authenticatedNextLink = nextLink.replace("bon-chef-recetas-ingredientes.myshopify.com", "87700134e27c0aca518cb36d356c837b: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@bon-chef-recetas-ingredientes.myshopify.com");

    return authenticatedNextLink;
}

async function fetchShopifyEntityCollection(entityCollectionName: string): Promise<any[]> {

    const fetch = require('node-fetch');

    let result: any[] = [];

    let url: string | null = `https://87700134e27c0aca518cb36d356c837b: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@bon-chef-recetas-ingredientes.myshopify.com/admin/api/2021-07/${entityCollectionName}.json`;

    let max = 100; // Limit to 100 pages in case headers format change on the API side, to avoide infinite looping.
    while (url && --max) {
        let response = await fetch(url);

        let value = await response.json();
        result.push(...value[entityCollectionName]);

        url = getNextLinkFromResponse(response);
    }

    return result;

}

async function migrateCustomers() {

    console.info("Customers migration is starting.");

    let shopifyCustomers: any[];
    let rechargeCustomers: any[];

    // await Promise.all([
    //     async () => {shopifyCustomers = await fetchShopifyEntityCollection('customers');},
    //     async () => {rechargeCustomers = await fetchRechargeEntityCollection('customers');}
    // ]) // Revisar por qué en paralelo falla.

    shopifyCustomers = await fetchShopifyEntityCollection('customers');
    rechargeCustomers = await fetchRechargeEntityCollection('customers');

    console.log("Shopify customers qty: ", shopifyCustomers.length);
    console.log("Recharge customers qty: ", rechargeCustomers.length);

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

        if (rechargeCustomer) {
            let stripeCustomer = (await stripe.customers.retrieve(rechargeCustomer.stripe_customer_token));

            console.log(stripeCustomer);


            stripeCustomerPaymentMethods = (await stripe.paymentMethods.list({
                customer: rechargeCustomer.stripe_customer_token,
                type: 'card'
            })).data;

            stripeCustomerPaymentMethods.forEach(pm => {
                if (pm.card)
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

        let billingAddresses
        
        // shopifyCustomer.addresses.forEach(address => {
            
        // });

        let letsCookCustomer = Customer.create(
            shopifyCustomer.email,
            true,
            rechargeCustomer?.stripe_customer_token,
            letsCookCustomerPaymentMethods,
            undefined, // Lat&Lon? No alcanza con calle y número?
            undefined, // Lat&Lon? No alcanza con calle y número?
            UserPassword.create(generateRandomPassword(), false), // generate randomly passing restrictions
            "active",
            undefined,
            new PersonalInfo(
                shopifyCustomer.first_name,
                shopifyCustomer.last_name,
                shopifyCustomer.phone ?? shopifyCustomer.addresses[0]?.phone,
                shopifyCustomer.addresses[1]?.phone,
                undefined,
                "es", // formato?
                undefined
            ),
            new CustomerId(uuidv5(shopifyCustomer.id, LETS_COOK_UUID_NAMESPACE)) // deterministic: always same id for same shopify customer ID
        );

        // Save
        // await customerRepository.save(letsCookCustomer);
    });

    console.info("Customers migration has ended.");

}

function generateRandomPassword(): string {
    return `#LetsCook${Math.random()*999999}!`;
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
    // await connectToDatabase();

    // En teoría acá sólo debería haber aggregate roots.
    await Promise.all([
        migrateCustomers()
        // migrateOrders()
    ]);

    console.info("All migration methods have ended.");
}

migrate();