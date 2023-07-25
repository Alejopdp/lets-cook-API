// import { Coupon } from "../../../../../bounded_contexts/operations/domain/cupons/Cupon";
// import { Locale } from "../../../../..//bounded_contexts/operations/domain/locale/Locale";
// import { Order } from "../../../../..//bounded_contexts/operations/domain/order/Order";
// import { Subscription } from "../../../../..//bounded_contexts/operations/domain/subscription/Subscription";
// import { mongooseCouponRepository } from "../../../../..//bounded_contexts/operations/infra/repositories/coupon";
// import { mongooseOrderRepository } from "../../../../..//bounded_contexts/operations/infra/repositories/order";
// import { mongooseSubscriptionRepository } from "../../../../..//bounded_contexts/operations/infra/repositories/subscription";
// import { createCoupon } from "../../../../..//bounded_contexts/operations/useCases/createCoupon";
// import { createSubscription } from "../../../../..//bounded_contexts/operations/useCases/createSubscription";
// import { skipOrders } from "../../../../..//bounded_contexts/operations/useCases/skipOrders";
// import { SkipOrdersDto } from "../../../../..//bounded_contexts/operations/useCases/skipOrders/skipOrdersDto";
// import { expect } from "chai";
// import { connectToDatabase } from "../../../../../infraestructure/mongoose/config/config";
// import { deleteCustomerSubscriptionsAndOrders, deleteCustomerSubscriptionsAndOrdersController } from "../../../../../bounded_contexts/operations/useCases/deleteCustomerSubscriptionsAndOrders";
// import { deleteCoupon } from "../../../../../bounded_contexts/operations/useCases/deleteCoupon";

// describe("Skipping orders of a subscription w 2 apply limit coupon", function () {
//     var subscription: Subscription;
//     var subscriptionOrders: Order[] = []
//     var skipOrdersDto: SkipOrdersDto | undefined;
//     var coupon: Coupon

//     before(async function () {
//         await connectToDatabase()
//         await createCoupon.execute({ couponCode: "2SEMANAS", discountType: "fix", discountValue: 2, endDate: undefined, limites: [], maxChargeQtyType: "more_one_fee", maxChargeQtyValue: 2, minRequireType: "none", minRequireValue: 0, productsForApplyingType: "all", productsForApplyingValue: undefined, startDate: new Date(2020, 5, 3), state: "ACTIVE" })
//         coupon = (await mongooseCouponRepository.findActiveByCode("2SEMANAS"))!
//         const { subscription: testSubscription } = await createSubscription.execute({ addressDetails: "", addressName: "", customerFirstName: "Alejo", customerId: "29511e87-1b24-4add-93b6-c3a9bfb73033", customerLastName: "Scotti", latitude: 41.372434, longitude: 2.1439804, paymentMethodId: "f8b0182c-c764-478d-88fc-6820e8962dda", phone1: "+34 684 336 519", planFrequency: "weekly", planId: "45d7b725-c025-4c7c-b1ae-846ee985c938", planVariantId: "20bcc5a6-fafa-48e3-8a49-ab43d395143a", restrictionComment: "", shippingCity: "", shippingCountry: "", shippingPostalCode: "", shippingProvince: "", stripePaymentMethodId: "pm_1KnWOKH24hlkZqHlwfuKsc17", couponId: coupon?.id.toString(), locale: Locale.es })
//         subscription = testSubscription
//         subscriptionOrders = await mongooseOrderRepository.findNextTwelveBySubscription(subscription.id, Locale.es)
//     });

//     describe("Skipping the next 3 orders", async function () {

//         before(async function () {
//             try {
//                 // subscriptionOrders[0] is billed, skippable orders are in "ACTIVE" state
//                 const ordersToSkip = [subscriptionOrders[1], subscriptionOrders[2], subscriptionOrders[3]].map(o => o.id.toString())
//                 skipOrdersDto = { nameOrEmailOfAdminExecutingRequest: "", ordersToReactivate: [], ordersToSkip, locale: Locale.es }
//                 await skipOrders.execute(skipOrdersDto)
//                 subscription = await mongooseSubscriptionRepository.findByIdOrThrow(subscription.id, Locale.es)
//                 subscriptionOrders = await mongooseOrderRepository.findNextTwelveBySubscription(subscription.id, Locale.es)
//             } catch (error) {
//                 console.log(error)
//             }
//         })


//         it("Should leave the subscription w 2 coupons application", function () {
//             expect(subscription.couponChargesQtyApplied).to.be.equal(2);
//         })

//         it("Should leave the 3 orders in skipped state", function () {
//             expect(subscriptionOrders[1].state.title).to.be.equal("ORDER_SKIPPED")
//             expect(subscriptionOrders[2].state.title).to.be.equal("ORDER_SKIPPED")
//             expect(subscriptionOrders[3].state.title).to.be.equal("ORDER_SKIPPED")
//         })

//         it("Should leave the skipped orders without discount amount", function () {
//             expect(subscriptionOrders[1].discountAmount).to.be.equal(0)
//             expect(subscriptionOrders[2].discountAmount).to.be.equal(0)
//             expect(subscriptionOrders[3].discountAmount).to.be.equal(0)
//         })

//         it("Should leave the next active order with a discount amount", function () {
//             expect(subscriptionOrders[4].discountAmount).to.be.equal(2)
//         })

//         it("Should leave the rest of active orders without a discount amount", function () {
//             expect(subscriptionOrders.slice(5).filter(o => o.discountAmount > 0).length).to.be.equal(0)
//         })
//     })

//     describe("Leaving the next order skipped and reactivating the next 2", async function () {
//         before(async function () {
//             try {
//                 subscriptionOrders = await mongooseOrderRepository.findNextTwelveBySubscription(subscription.id, Locale.es)
//                 const ordersToReactivate = [subscriptionOrders[2], subscriptionOrders[3]].map(o => o.id.toString())
//                 skipOrdersDto = { nameOrEmailOfAdminExecutingRequest: "", ordersToReactivate: ordersToReactivate, ordersToSkip: [], locale: Locale.es }
//                 await skipOrders.execute(skipOrdersDto)
//                 skipOrdersDto = { nameOrEmailOfAdminExecutingRequest: "", ordersToReactivate: [subscriptionOrders[1]].map(o => o.id.toString()), ordersToSkip: [subscriptionOrders[3]].map(o => o.id.toString()), locale: Locale.es }
//                 await skipOrders.execute(skipOrdersDto)
//                 skipOrdersDto = { nameOrEmailOfAdminExecutingRequest: "", ordersToReactivate: [subscriptionOrders[3]].map(o => o.id.toString()), ordersToSkip: [], locale: Locale.es }
//                 await skipOrders.execute(skipOrdersDto)
//                 skipOrdersDto = { nameOrEmailOfAdminExecutingRequest: "", ordersToReactivate: [], ordersToSkip: [subscriptionOrders[1], subscriptionOrders[2]].map(o => o.id.toString()), locale: Locale.es }
//                 await skipOrders.execute(skipOrdersDto)
//                 skipOrdersDto = { nameOrEmailOfAdminExecutingRequest: "", ordersToReactivate: ordersToReactivate, ordersToSkip: [], locale: Locale.es }
//                 await skipOrders.execute(skipOrdersDto)

//                 subscription = await mongooseSubscriptionRepository.findByIdOrThrow(subscription.id, Locale.es)
//                 subscriptionOrders = await mongooseOrderRepository.findNextTwelveBySubscription(subscription.id, Locale.es)
//             } catch (error) {
//                 console.log(error)
//             }
//         })

//         it("Should leave the subscription with 2 coupons applies", function () {
//             expect(subscription.couponChargesQtyApplied).to.be.equal(2);
//         })
//         it("Should leave the closest order with a discount amount", function () {
//             expect(subscriptionOrders[2].discountAmount).to.be.equal(2)
//         })
//         it("Should leave the rest of orders without a discount amount", function () {
//             expect(subscriptionOrders.slice(3).filter(o => o.discountAmount > 0).length).to.be.equal(0)
//         })

//     })

//     after(async () => {
//         try {
//             await Promise.all([deleteCustomerSubscriptionsAndOrders.execute({ customerId: "29511e87-1b24-4add-93b6-c3a9bfb73033" }), deleteCoupon.execute({ couponId: coupon.id.toString() })])
//             // done()
//         } catch (error) {
//             console.log(error)
//         }
//     })
// });

// describe("Skipping orders of a subscription w a 20 apply limit coupon", function () {
//     var subscription: Subscription;
//     var subscriptionOrders: Order[] = []
//     var skipOrdersDto: SkipOrdersDto | undefined;
//     var coupon: Coupon

//     before(async function () {
//         await connectToDatabase()
//         await createCoupon.execute({ couponCode: "20SEMANAS", discountType: "fix", discountValue: 2, endDate: undefined, limites: [], maxChargeQtyType: "more_one_fee", maxChargeQtyValue: 20, minRequireType: "none", minRequireValue: 0, productsForApplyingType: "all", productsForApplyingValue: undefined, startDate: new Date(2020, 5, 3), state: "ACTIVE" })
//         coupon = (await mongooseCouponRepository.findActiveByCode("20SEMANAS"))!
//         const { subscription: testSubscription } = await createSubscription.execute({ addressDetails: "", addressName: "", customerFirstName: "Alejo", customerId: "29511e87-1b24-4add-93b6-c3a9bfb73033", customerLastName: "Scotti", latitude: 41.372434, longitude: 2.1439804, paymentMethodId: "f8b0182c-c764-478d-88fc-6820e8962dda", phone1: "+34 684 336 519", planFrequency: "weekly", planId: "45d7b725-c025-4c7c-b1ae-846ee985c938", planVariantId: "20bcc5a6-fafa-48e3-8a49-ab43d395143a", restrictionComment: "", shippingCity: "", shippingCountry: "", shippingPostalCode: "", shippingProvince: "", stripePaymentMethodId: "pm_1KnWOKH24hlkZqHlwfuKsc17", couponId: coupon?.id.toString(), locale: Locale.es })
//         subscription = testSubscription
//         subscriptionOrders = await mongooseOrderRepository.findNextTwelveBySubscription(subscription.id, Locale.es)
//     });

//     describe("Skipping all orders", async function () {

//         before(async function () {
//             try {
//                 // subscriptionOrders[0] is billed, skippable orders are in "ACTIVE" state
//                 const ordersToSkip = subscriptionOrders.map(o => o.id.toString()).slice(1)
//                 skipOrdersDto = { nameOrEmailOfAdminExecutingRequest: "", ordersToReactivate: [], ordersToSkip, locale: Locale.es }
//                 await skipOrders.execute(skipOrdersDto)
//                 subscription = await mongooseSubscriptionRepository.findByIdOrThrow(subscription.id, Locale.es)
//                 subscriptionOrders = await mongooseOrderRepository.findNextTwelveBySubscription(subscription.id, Locale.es)
//             } catch (error) {
//                 console.log(error)
//             }
//         })


//         it("Should leave the subscription w 1 coupons application", function () {
//             expect(subscription.couponChargesQtyApplied).to.be.equal(1);
//         })

//         it("Should leave all the orders in skipped", function () {
//             expect(subscriptionOrders.slice(1).filter(o => o.isSkipped()).length).to.be.equal(11)
//         })

//         it("Should leave the skipped orders without discount amount", function () {
//             expect(subscriptionOrders[1].discountAmount).to.be.equal(0)
//             expect(subscriptionOrders[2].discountAmount).to.be.equal(0)
//             expect(subscriptionOrders[3].discountAmount).to.be.equal(0)
//             expect(subscriptionOrders[4].discountAmount).to.be.equal(0)
//             expect(subscriptionOrders[5].discountAmount).to.be.equal(0)
//             expect(subscriptionOrders[6].discountAmount).to.be.equal(0)
//             expect(subscriptionOrders[7].discountAmount).to.be.equal(0)
//             expect(subscriptionOrders[8].discountAmount).to.be.equal(0)
//             expect(subscriptionOrders[9].discountAmount).to.be.equal(0)
//             expect(subscriptionOrders[10].discountAmount).to.be.equal(0)
//             expect(subscriptionOrders[11].discountAmount).to.be.equal(0)
//         })

//         it("Should not leave any active order", function () {
//             expect(subscriptionOrders.filter(o => o.isActive()).length).to.be.equal(0)
//         })

//         describe("Reactivating 5 orders", async function () {
//             before(async function () {
//                 try {
//                     subscriptionOrders = await mongooseOrderRepository.findNextTwelveBySubscription(subscription.id, Locale.es)
//                     const ordersToReactivate = [subscriptionOrders[5], subscriptionOrders[6], subscriptionOrders[2], subscriptionOrders[8], subscriptionOrders[11]].map(o => o.id.toString())
//                     skipOrdersDto = { nameOrEmailOfAdminExecutingRequest: "", ordersToReactivate: ordersToReactivate, ordersToSkip: [], locale: Locale.es }
//                     await skipOrders.execute(skipOrdersDto)
//                     subscription = await mongooseSubscriptionRepository.findByIdOrThrow(subscription.id, Locale.es)
//                     subscriptionOrders = await mongooseOrderRepository.findNextTwelveBySubscription(subscription.id, Locale.es)
//                 } catch (error) {
//                     console.log(error)
//                 }
//             })

//             it("Should leave the subscription with 6 coupons applies", function () {
//                 expect(subscription.couponChargesQtyApplied).to.be.equal(6);
//             })

//             it("Should leave the closest orders with an ACTIVE state", function () {
//                 expect(subscriptionOrders[2].state.title).to.be.equal("ORDER_ACTIVE")
//                 expect(subscriptionOrders[5].state.title).to.be.equal("ORDER_ACTIVE")
//                 expect(subscriptionOrders[6].state.title).to.be.equal("ORDER_ACTIVE")
//                 expect(subscriptionOrders[8].state.title).to.be.equal("ORDER_ACTIVE")
//                 expect(subscriptionOrders[11].state.title).to.be.equal("ORDER_ACTIVE")
//             })

//             it("Should leave the closest orders with a discount amount", function () {
//                 expect(subscriptionOrders[2].discountAmount).to.be.equal(2)
//                 expect(subscriptionOrders[5].discountAmount).to.be.equal(2)
//                 expect(subscriptionOrders[6].discountAmount).to.be.equal(2)
//                 expect(subscriptionOrders[8].discountAmount).to.be.equal(2)
//                 expect(subscriptionOrders[11].discountAmount).to.be.equal(2)
//             })

//             it("Should leave the rest of orders without a discount amount", function () {
//                 expect(subscriptionOrders.filter(o => o.isSkipped()).length).to.be.equal(6)
//                 expect(subscriptionOrders.filter(o => o.discountAmount === 0).length).to.be.equal(6)
//             })

//         })

//     })


//     after(async () => {
//         try {
//             await Promise.all([deleteCustomerSubscriptionsAndOrders.execute({ customerId: "29511e87-1b24-4add-93b6-c3a9bfb73033" }), deleteCoupon.execute({ couponId: coupon.id.toString() })])
//         } catch (error) {
//             console.log(error)
//         }
//     })
// });