// To run from root, execute the following:
// npm exec ts-node scripts/shopifyMigration/migrate.ts

import Stripe from "stripe";
import { UserPassword } from "../../src/bounded_contexts/IAM/domain/user/UserPassword";
// USE NON-PROD KEY
import { stripeService } from "../../src/bounded_contexts/operations/application/paymentService";
import { Billing } from "../../src/bounded_contexts/operations/domain/billing/Billing";
import { Customer } from "../../src/bounded_contexts/operations/domain/customer/Customer";
import { PaymentMethod } from "../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod";
import { PersonalInfo } from "../../src/bounded_contexts/operations/domain/customer/personalInfo/PersonalInfo";
import { ICustomerRepository } from "../../src/bounded_contexts/operations/infra/repositories/customer/ICustomerRepository";
import { MongooseCustomerRepository } from "../../src/bounded_contexts/operations/infra/repositories/customer/mongooseCustomerRepository";
import { connectToDatabase } from "../../src/infraestructure/mongoose/config/config";
import { v4 as uuidv4 } from 'uuid';
import { CustomerId } from "../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { Address } from "../../src/bounded_contexts/operations/domain/address/Address";
import { Subscription } from "../../src/bounded_contexts/operations/domain/subscription/Subscription";
import { PlanVariantId } from "../../src/bounded_contexts/operations/domain/plan/PlanVariant/PlanVariantId";
import { MongoosePlanRepository } from "../../src/bounded_contexts/operations/infra/repositories/plan/mongoosePlanRepository";
import { PlanFrequencyFactory } from "../../src/bounded_contexts/operations/domain/plan/PlanFrequency/PlanFrequencyFactory";
import { SubscriptionStateFactory } from "../../src/bounded_contexts/operations/domain/subscription/subscriptionState/SubscriptionStateFactory";

const stripeConfig: Stripe.StripeConfig = {
    apiVersion: "2020-08-27",
};
// USE PROD KEY
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, stripeConfig);

async function fetchRechargeEntityCollection(entityCollectionName: string): Promise<any[]> {

    const fetch = require('node-fetch');

    let page = 1;
    let result: any[] = [];

    do {

        console.log(`Fetching ${entityCollectionName} from Recharge, page ${page}.`);

        let request = fetch(
            `https://api.rechargeapps.com/${entityCollectionName}?limit=250&page=${page}`, {
            method: 'GET',
            headers: { "X-Recharge-Access-Token": "fca35e686341f59f50c3222d61ef0d645a09c7434f4ee93aea04127169b043f5" }
        });
        let response = await request;
        let value = await response.json();

        let pageEntities = value[entityCollectionName];

        if (!pageEntities.length)
            break;

        result.push(...pageEntities);

    } while (++page <= 100)

    return result;
}

function getNextLinkFromResponse(response: any): string | null {
    let linkHeader: string = response.headers.get("Link");

    var rels = linkHeader.split(",");
    var nextRel = rels.find(r => r.indexOf("next") >= 0);

    if (nextRel == undefined)
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
    let page = 0;
    while (url && --max) {

        console.log(`Fetching ${entityCollectionName} from Shopify, page ${++page}.`);

        let response = await fetch(url);

        // console.log(response);

        let value = await response.json();
        result.push(...value[entityCollectionName]);

        url = getNextLinkFromResponse(response);
    }

    return result;

}

const variantMapping = {
    "25997667074148": '66b5cb5b-bb1e-4b77-975d-58798e597525', //GOUR1
    "25997667106916": 'aee002e1-79fb-4ebe-bf29-6b14b7e49d73', //GOUR2
    "25997667139684": '9a2351e6-7515-48d7-9cef-069b8be72871', //GOUR3
    "27290791247972": '6f718306-bbc1-4e73-aafb-ffee8aab4f4a', //GOUR4
    "26075281719396": '5a5fb45f-be8f-4865-9adb-7074f7c5fb19', //GOUR5
    "26075291746404": 'bdd07a0a-e379-40d5-b9e6-2269219e17a9', //GOUR6
    "26075305246820": 'fa6c6ff6-c0ba-4c22-a555-822a38cd4420', //GOUR7
    "27290798522468": '8243fa14-d55c-4d2c-8264-15aa1416a596', //GOUR8
    "35573401616537": '787fc181-fc6d-4d76-a113-c8a3996ed3fe', //FAMI5
    "35573401649305": 'a9ab8372-2b7b-4e9c-8c91-9a71ca53e3a1', //FAMI6
    "35573401682073": '847f04de-353c-42e4-943d-15df0b06090f', //FAMI7
    "35573401714841": 'a577f708-6155-48b4-ab37-500760feab1c', //FAMI8
    "25997365936228": '1c0f0d5f-f893-4954-a5e2-f3943c784a62', //VEGE1
    "25997365968996": '92833c54-1da8-4876-875d-f2d18bc8cafd', //VEGE2
    "25997366034532": 'b61e3079-a1c0-4d0e-b210-afa4139baf86', //VEGE3
    "27290854588516": '21b26030-688c-4c7a-92f9-1015959c605a', //VEGE4
    "26074845184100": 'e8e103bc-2cb9-49e0-a8a1-d2d9bc371cfa', //VEGE5
    "26074919108708": '51924d4c-eb51-41d7-840b-d45c9c53e7a7', //VEGE6
    "26074927923300": 'cb8f9d75-4a98-4392-b270-1f49e02c9c4e', //VEGE7
    "27290857177188": 'd775360d-8eb8-4a0d-985c-3c526d82a933', //VEGE8
    "39746262204569": '80b0c343-f829-4f45-8959-5bb2b1b3895f', //VEGA1
    "39746262237337": '2ace1dd0-0feb-4e3b-8b9d-bc4c697a8672', //VEGA2
    "39746262270105": '0b592db9-a9ad-4cec-b26e-d27e3f7a4f31', //VEGA3
    "39746262302873": 'be719cb2-9835-4eb0-ae13-0f56750a240b', //VEGA4
    "39746262335641": '8fc65449-6f3b-4354-a209-0b328d9f1638', //VEGA5
    "39746262368409": '6fbf1f1c-4e1f-495d-b6d6-992224140203', //VEGA6
    "39746262401177": '9cca5332-7cd6-4063-bf75-36f8f81cfd1c', //VEGA7
    "39746262433945": '45f0bc4c-7c49-4dbf-bb86-05ef2fec535b', //VEGA8
    "25991289733220": 'f2ed8663-6bb6-4867-b73b-6f51f9107f74', //AHOR1
    "25991289798756": '3c0d136d-c98e-44bb-8453-c31ef7e54ada', //AHOR2
    "25991289864292": '573ffd77-fe5b-4242-bd68-4d6c912ba2ef', //AHOR3
    "27290693697636": '9bb23977-54cb-48ad-80a5-3548fb6fa910', //AHOR4
    "26048533594212": 'e03c1ebf-3221-490f-a262-5b4899c70267', //AHOR6
    "26048603684964": 'aa33f617-2f9c-45bb-87a8-2720b1deb329', //AHOR7
    "27290701496420": 'a51f0a00-afb0-498a-9bae-e3db74da37e0', //AHOR8
    "37053063889049": '77d217d6-306e-4d79-93c6-9b0eaa29cf91', //PLDES2
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

        console.log(`Processing customer with id ${shopifyCustomer.id}.`);

        let existingCustomer = await customerRepository.findByEmail(shopifyCustomer.email);

        let rechargeCustomer = rechargeCustomers.find(rc => rc.shopify_customer_id == shopifyCustomer.id);

        let stripeCustomerPaymentMethods: Stripe.PaymentMethod[] = [];
        let letsCookCustomerPaymentMethods: PaymentMethod[] = [];

        if (rechargeCustomer?.stripe_customer_token) {
            let stripeCustomer = (await stripe.customers.retrieve(rechargeCustomer.stripe_customer_token));

            if (stripeCustomer) {

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

        }

        let stripeId = rechargeCustomer?.stripe_customer_token;

        if (!stripeId)
            if(!shopifyCustomer.email)
            {
                console.log(`Excluding customer with id ${shopifyCustomer.id} because they have no email and no stripe id.`);
                return; // skips the customer if no stipe id AND no email
            }
            else
                stripeId = await stripeService.createCustomer(shopifyCustomer.email);

        let letsCookCustomer = Customer.create(
            shopifyCustomer.email,
            true,
            rechargeCustomer?.stripe_customer_token,
            letsCookCustomerPaymentMethods,
            undefined,
            undefined,
            UserPassword.create(generateRandomPassword(shopifyCustomer.id), false), // generate randomly passing restrictions
            "active",
            undefined,
            !shopifyCustomer.first_name || !shopifyCustomer.last_name ?
                undefined :
                new PersonalInfo(
                    shopifyCustomer.first_name,
                    shopifyCustomer.last_name,
                    shopifyCustomer.phone ?? shopifyCustomer.addresses[0]?.phone,
                    shopifyCustomer.addresses[1]?.phone,
                    undefined,
                    "es", // formato?
                    undefined
                ),
            new CustomerId(uuidv4())
        );

        // Save
        await customerRepository.save(letsCookCustomer);
        
    });

    console.info("Customers migration has ended.");

}

function generateRandomPassword(customerId: number): string {
    return `#LetsCook${customerId}!`;
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

async function migrateSubscriptions()
{

    let shopifyOrders = await fetchShopifyEntityCollection('orders');
    let shopifyProducts = await fetchShopifyEntityCollection('products');

    let customerRepository = new MongooseCustomerRepository();
    let planRepository = new MongoosePlanRepository();
    
    shopifyOrders
        .filter(so => (so.tags as string).includes('Subscription'))
        .forEach(so => {
            (so.line_items as any[]).forEach(async li => {
                let shopifyProductId: number = li.product_id;
                let shopifyVariantId: number = li.variant_id;
                let shopifyProduct = shopifyProducts.find(sp => sp.id == shopifyProductId);
                let shopifyVariant = (shopifyProduct.variants as any[]).find(sv => sv.id == shopifyVariantId);
                let sku = shopifyVariant.sku;
                let customerEmail = so.customer.email;
                //@ts-ignore
                let letsCookVariantId: string = variantMapping[shopifyVariantId.toString()];
                
                // console.log(
                //     customerEmail,
                //     shopifyVariantId,
                //     letsCookVariantId,
                //     sku
                // );

                let planVariantId = new PlanVariantId(letsCookVariantId);

                console.log(li.properties);

                // let subscription = new Subscription(
                //     planVariantId,
                //     (await planRepository.findByPlanVariantId(planVariantId))!,
                //     PlanFrequencyFactory.createPlanFrequency(""),
                //     SubscriptionStateFactory.createState(""),
                //     '',
                //     new Date(so.created_at) as Date,
                //     (await customerRepository.findByEmail(customerEmail))!,
                //     so.total_price
                // );

                //save subcription to db here

            });
    });

}

async function migrate() {
    process.env.NODE_ENV = 'shopify-migration-tests';
    await connectToDatabase();

    // En teoría acá sólo debería haber aggregate roots.
    await Promise.all([
        // migrateCustomers(),
        migrateSubscriptions(),
        // migrateOrders()
    ]);

    console.info("All migration methods have ended.");
}

migrate();