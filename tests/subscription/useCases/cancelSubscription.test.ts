jest.mock("../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService")
import { ChooseRecipesForOrder } from "../../../src/bounded_contexts/operations/useCases/chooseRecipesForOrder/chooseRecipesForOrder"
import { CreateSubscription, CreateSubscriptionResponse } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscription"
import { CreateSubscriptionAsAdmin, CreateSubscriptionAsAdminResponse } from "../../../src/bounded_contexts/operations/useCases/createSubscriptionAsAdmin/createSubscriptionAsAdmin"
import { CreateSubscriptionAsAdminDto } from "../../../src/bounded_contexts/operations/useCases/createSubscriptionAsAdmin/createSubscriptionAsAdminDto"
import { CancelASubscription } from "../../../src/bounded_contexts/operations/useCases/cancelASubscription/cancelASubscription"
import { Subscription } from "../../../src/bounded_contexts/operations/domain/subscription/Subscription"
import { Customer } from "../../../src/bounded_contexts/operations/domain/customer/Customer";
import { InMemoryCustomerRepository } from "../../../src/bounded_contexts/operations/infra/repositories/customer/inMemoryCustomerRepository";
import { CustomerId } from "../../../src/bounded_contexts/operations/domain/customer/CustomerId";
import { InMemorySusbcriptionRepository } from "../../../src/bounded_contexts/operations/infra/repositories/subscription/inMemorySubscriptionRepository";
import { InMemoryShippingZoneRepository } from "../../../src/bounded_contexts/operations/infra/repositories/shipping/inMemoryShippingZoneRepository";
import { InMemoryPlanRepository } from "../../../src/bounded_contexts/operations/infra/repositories/plan/mockPlanRepository";
import { MockWeekRepository } from "../../../src/bounded_contexts/operations/infra/repositories/week/mockWeekRepository";
import { InMemoryOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/order/mockOrderRepository";
import { InMemoryCouponRepository } from "../../../src/bounded_contexts/operations/infra/repositories/coupon/mockCouponRepository";
import { MockPaymentService } from "../../../src/bounded_contexts/operations/application/paymentService/mockPaymentService";
import { MockNotificationService } from "../../../src/shared/notificationService/mockNotificationService";
import { InMemoryPaymentOrderRepository } from "../../../src/bounded_contexts/operations/infra/repositories/paymentOrder/mockPaymentOrderRepository";
import { InMemoryRateRepository } from "../../../src/bounded_contexts/operations/infra/repositories/rate/inMemoryRateRepository";
import { InMemoryLogRepository } from "../../../src/bounded_contexts/operations/infra/repositories/log/mockLogRepository";
import { MockRecipeRepository } from "../../../src/bounded_contexts/operations/infra/repositories/recipe/mockRecipeRepository";
import { CreateFriendCode } from "../../../src/bounded_contexts/operations/services/createFriendCode/createFriendCode";
import { CreatePaymentOrders } from "../../../src/bounded_contexts/operations/services/createPaymentOrders/createPaymentOrders";
import { AssignOrdersToPaymentOrders } from "../../../src/bounded_contexts/operations/services/assignOrdersToPaymentOrders/assignOrdersToPaymentOrders";
import { Locale } from "../../../src/bounded_contexts/operations/domain/locale/Locale";
import { gourmetPlan, planGourmetVariant2Persons2Recipes, planVegetariano, planVegetarianoVariant2Persons2Recipes, planVegetarianoVariant2Persons4Recipes } from "../../mocks/plan";
import { arepasDeCrhistian, bowlDeQuinoa, burgerHallouli, rissotoDeBoniato } from "../../mocks/recipe";
import { CUSTOMER_ADDRESS_DETAILS, CUSTOMER_ADDRESS_NAME, CUSTOMER_EMAIL, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_LATITUDE, CUSTOMER_LONGITUDE, CUSTOMER_PASSWORD, CUSTOMER_PHONE } from "../../mocks/customer"
import { ShippingZoneRadio } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/ShippingZoneRadio";
import { Coordinates } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZoneRadio/Coordinates";
import { TUESDAY } from "../../mocks/days";
import { ShippingZone } from "../../../src/bounded_contexts/operations/domain/shipping/ShippingZone";
import { IMailingListService } from "../../../src/bounded_contexts/operations/application/mailingListService/IMailingListService";
import { MockMailingListService } from "../../../src/bounded_contexts/operations/application/mailingListService/mockMailingListService";
import { CreateSubscriptionDto } from "../../../src/bounded_contexts/operations/useCases/createSubscription/createSubscriptionDto";
import { Order } from "../../../src/bounded_contexts/operations/domain/order/Order";
import { PaymentOrder } from "../../../src/bounded_contexts/operations/domain/paymentOrder/PaymentOrder";
import { Log } from "../../../src/bounded_contexts/operations/domain/customer/log/Log";
import { LogType } from "../../../src/bounded_contexts/operations/domain/customer/log/LogType";
import { PaymentMethod } from "../../../src/bounded_contexts/operations/domain/customer/paymentMethod/PaymentMethod"
import { PaymentIntent } from "../../../src/bounded_contexts/operations/application/paymentService"
import { PayAllSubscriptions } from "../../../src/bounded_contexts/operations/services/payAllSubscriptions/payAllSubscriptions"


const mockSubscriptionRepository = new InMemorySusbcriptionRepository([])
const mockShippingZoneRepository = new InMemoryShippingZoneRepository([])
const mockPlanRepository = new InMemoryPlanRepository([])
const mockWeekRepository = new MockWeekRepository()
const mockOrderRepository = new InMemoryOrderRepository([])
const mockCustomerRepository = new InMemoryCustomerRepository([])
const mockCouponRepository = new InMemoryCouponRepository([])
const mockPaymentService = new MockPaymentService() as jest.Mocked<MockPaymentService>
const mockNotificationService = new MockNotificationService()
const mockPaymentOrderRepository = new InMemoryPaymentOrderRepository([])
const mockRecipeRatingRepository = new InMemoryRateRepository([])
const mockLogRepository = new InMemoryLogRepository([])
const mockRecipeRepository = new MockRecipeRepository([])

mockPlanRepository.bulkSave([gourmetPlan, planVegetariano])
mockRecipeRepository.save(burgerHallouli)
mockRecipeRepository.save(arepasDeCrhistian)
mockRecipeRepository.save(rissotoDeBoniato)
mockRecipeRepository.save(bowlDeQuinoa)

const mockCreateFriendCodeService = new CreateFriendCode(mockCouponRepository, mockCustomerRepository)
const createPaymentOrdersService: CreatePaymentOrders = new CreatePaymentOrders()
const assignOrdersToPaymentOrderService = new AssignOrdersToPaymentOrders(mockPaymentOrderRepository, createPaymentOrdersService)
const mockMailingListService: IMailingListService = new MockMailingListService()


const createSubscriptionUseCase = new CreateSubscription(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockCouponRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockLogRepository, mockCreateFriendCodeService)
const chooseRecipesForOrderUseCase = new ChooseRecipesForOrder(mockOrderRepository, mockRecipeRepository, mockPaymentOrderRepository, mockLogRepository, mockRecipeRatingRepository)
const cancelASubscriptionUseCase = new CancelASubscription(mockSubscriptionRepository, mockOrderRepository, mockPaymentOrderRepository, mockNotificationService, mockMailingListService, mockLogRepository, mockRecipeRatingRepository)
const createSubscriptionAsAdminUseCase = new CreateSubscriptionAsAdmin(mockCustomerRepository, mockSubscriptionRepository, mockShippingZoneRepository, mockPlanRepository, mockWeekRepository, mockOrderRepository, mockPaymentService, mockNotificationService, assignOrdersToPaymentOrderService, mockPaymentOrderRepository, mockCouponRepository, mockCreateFriendCodeService)
const payAllSubscriptions = new PayAllSubscriptions(mockCustomerRepository, mockOrderRepository, mockPaymentOrderRepository, mockPaymentService, mockSubscriptionRepository, mockWeekRepository, mockShippingZoneRepository, mockNotificationService)

const valenciaPolygon = [
    [39.75, -0.78],  // Noroeste
    [39.75, -0.22],  // Noreste
    [38.98, -0.22],  // Sureste
    [38.98, -0.78]   // Suroeste
];
const customerShippingZoneRadio = new ShippingZoneRadio(valenciaPolygon.map((coordinates) => new Coordinates(coordinates[0], coordinates[1])))
const MOCK_SHIPPING_COST = 10
const customerShippingZone = ShippingZone.create("Valencia", "valencia", MOCK_SHIPPING_COST, "active", customerShippingZoneRadio, TUESDAY)
mockShippingZoneRepository.save(customerShippingZone)

mockPaymentService.createPaymentIntentAndSetupForFutureUsage.mockImplementation(async (amount: number, paymentMethod: string, receiptEmail: string, customerId: string): Promise<PaymentIntent> => ({
    client_secret: "client_secret",
    id: "id",
    status: "succeeded",
    amount: 0
}))

describe('Cancel subscriptiont tests', () => {
    describe("Given a user with an active subscription and recipes chosen", () => {
        const CUSTOMER_ID = new CustomerId()
        let customer: Customer
        let subscriptionResult: any
        const PURCHASE_DATE: Date = new Date(2023, 7, 3, 17)
        var subscription: Subscription

        beforeAll(async () => {
            customer = Customer.create(
                CUSTOMER_EMAIL,
                true,
                "",
                [],
                0,
                new Date(),
                undefined,
                undefined,
                CUSTOMER_PASSWORD,
                "active",
                undefined,
                undefined,
                CUSTOMER_ID
            )
            await mockCustomerRepository.save(customer)

            const createSubscriptionDto: CreateSubscriptionDto = {
                customerId: CUSTOMER_ID.toString(),
                planId: planVegetariano.id.toString(),
                planVariantId: planVegetarianoVariant2Persons2Recipes.id.toString(),
                planFrequency: "weekly",
                restrictionComment: "string",
                stripePaymentMethodId: "",
                couponId: undefined,
                paymentMethodId: "string",
                addressName: CUSTOMER_ADDRESS_NAME,
                addressDetails: CUSTOMER_ADDRESS_DETAILS,
                latitude: CUSTOMER_LATITUDE,
                longitude: CUSTOMER_LONGITUDE,
                customerFirstName: CUSTOMER_FIRST_NAME,
                customerLastName: CUSTOMER_LAST_NAME,
                phone1: CUSTOMER_PHONE,
                locale: Locale.es,
                shippingCity: "Alboraya",
                shippingProvince: "Valencia",
                shippingPostalCode: "46120",
                shippingCountry: "España",
                purchaseDate: PURCHASE_DATE
            }
            subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
            subscription = subscriptionResult.subscription

            arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, subscriptionResult.firstOrder.week]
            rissotoDeBoniato.availableWeeks = [...rissotoDeBoniato.availableWeeks, subscriptionResult.firstOrder.week]

            await chooseRecipesForOrderUseCase.execute({
                isAdminChoosing: false,
                orderId: subscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 1, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }, { quantity: 1, recipeId: rissotoDeBoniato.id.toString(), recipeVariantId: rissotoDeBoniato.recipeVariants[0].id.toString() }],
                choosingDate: PURCHASE_DATE,
                isInCheckout: false
            })
        })

        describe("When the user cancels the subscription", () => {
            beforeAll(async () => {
                await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: subscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "alejoscotti@gmail.com", queryDate: new Date(2023, 7, 4, 17) })
            })

            it("It should leave the subscription in SUBSCRIPTION_CANCELLED state", () => {
                expect(subscription.state.isCancelled()).toBeTruthy()
            })

            it("Should remove the shipping dates from the recipe ratings", async () => {
                const customerRatings = await mockRecipeRatingRepository.findAllByCustomer(CUSTOMER_ID, Locale.es)

                expect(customerRatings[0].shippingDates.length).toBe(0)
                expect(customerRatings[1].shippingDates.length).toBe(0)
            })

            it("Should leave the billed orders in BILLED state", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscription.id)

                expect(orders.filter(order => order.state.isBilled()).length).toBe(1)
            })

            it("Should leave the related orders in CANCELLED state", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscription.id)

                expect(orders.filter(order => order.isCancelled()).length).toBe(11)
            })

            it("Should leave the billed payment orders in BILLED state", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders.filter(paymentOrder => paymentOrder.isBilled()).length).toBe(1)
            })

            it("Should leave the related payment orders in CANCELLED state", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders.filter(paymentOrder => paymentOrder.isCancelled()).length).toBe(11)
            })

            it("Should leave the payment orders amount equal to 0", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders.filter(paymentOrder => paymentOrder.amount === 0).length).toBe(11)
            })

            it("Should save one CANCELLED log", async () => {
                const logs: Log[] = await mockLogRepository.findAllByCustomer(CUSTOMER_ID)

                expect(logs.filter(log => log.type === LogType.SUBSCRIPTION_CANCELLED).length).toBe(1)
            })
        })
    })

    describe("Given a user with a Plan Ahorro subscription", () => {
        describe("When the user cancels the subscription twice", () => {
            const CUSTOMER_ID = new CustomerId()
            let customer: Customer
            let subscriptionResult: any
            const PURCHASE_DATE: Date = new Date(2023, 7, 9, 17)
            var subscription: Subscription
            const cancellationDate: Date = new Date(2023, 7, 15, 14, 30, 0, 0)
            const secondCancellationDate: Date = new Date(2023, 7, 15, 14, 30, 0, 1)

            beforeAll(async () => {
                customer = Customer.create(
                    CUSTOMER_EMAIL,
                    true,
                    "",
                    [],
                    0,
                    new Date(),
                    undefined,
                    undefined,
                    CUSTOMER_PASSWORD,
                    "active",
                    undefined,
                    undefined,
                    CUSTOMER_ID
                )
                await mockCustomerRepository.save(customer)

                const createSubscriptionDto: CreateSubscriptionDto = {
                    customerId: CUSTOMER_ID.toString(),
                    planId: planVegetariano.id.toString(),
                    planVariantId: planVegetarianoVariant2Persons2Recipes.id.toString(),
                    planFrequency: "weekly",
                    restrictionComment: "string",
                    stripePaymentMethodId: "",
                    couponId: undefined,
                    paymentMethodId: "string",
                    addressName: CUSTOMER_ADDRESS_NAME,
                    addressDetails: CUSTOMER_ADDRESS_DETAILS,
                    latitude: CUSTOMER_LATITUDE,
                    longitude: CUSTOMER_LONGITUDE,
                    customerFirstName: CUSTOMER_FIRST_NAME,
                    customerLastName: CUSTOMER_LAST_NAME,
                    phone1: CUSTOMER_PHONE,
                    locale: Locale.es,
                    shippingCity: "Alboraya",
                    shippingProvince: "Valencia",
                    shippingPostalCode: "46120",
                    shippingCountry: "España",
                    purchaseDate: PURCHASE_DATE
                }
                subscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)
                subscription = subscriptionResult.subscription

                arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, subscriptionResult.firstOrder.week]
                rissotoDeBoniato.availableWeeks = [...rissotoDeBoniato.availableWeeks, subscriptionResult.firstOrder.week]

                await chooseRecipesForOrderUseCase.execute({
                    isAdminChoosing: false,
                    orderId: subscriptionResult.firstOrder.id.toString(),
                    recipeSelection: [{ quantity: 1, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }, { quantity: 1, recipeId: rissotoDeBoniato.id.toString(), recipeVariantId: rissotoDeBoniato.recipeVariants[0].id.toString() }],
                    choosingDate: PURCHASE_DATE,
                    isInCheckout: false
                })

                await Promise.all([cancelASubscriptionUseCase.execute({ cancellationComment: "Test", cancellationReason: "", queryDate: cancellationDate, subscriptionId: subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "" }), cancelASubscriptionUseCase.execute({ cancellationComment: "Test", cancellationReason: "", queryDate: secondCancellationDate, subscriptionId: subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "" })])
            })

            it("It should leave the subscription in SUBSCRIPTION_CANCELLED state", () => {
                expect(subscription.state.isCancelled()).toBeTruthy()
            })

            it("Should leave the billed orders in BILLED state", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscription.id)

                expect(orders.filter(order => order.state.isBilled()).length).toBe(1)
            })

            it("Should leave the related orders in CANCELLED state", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(subscription.id)

                expect(orders.filter(order => order.isCancelled()).length).toBe(11)
            })

            it("Should leave the billed payment orders in BILLED state", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders.filter(paymentOrder => paymentOrder.isBilled()).length).toBe(1)
            })

            it("Should leave the related payment orders in CANCELLED state", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders.filter(paymentOrder => paymentOrder.isCancelled()).length).toBe(11)
            })

            it("Should leave the payment orders amount equal to 0", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders.filter(paymentOrder => paymentOrder.amount === 0).length).toBe(11)
            })

            it("Should save one CANCELLED log", async () => {
                const logs: Log[] = await mockLogRepository.findAllByCustomer(CUSTOMER_ID)

                expect(logs.filter(log => log.type === LogType.SUBSCRIPTION_CANCELLED).length).toBe(2)
            })

        })
    })
    describe("Given a customer with 2 subscriptions", () => {
        const FIRST_SUBSCRIPTION_PURCHASE_DATE = new Date(2023, 6, 29, 17)
        const SECOND_SUBSCRIPTION_PURCHASE_DATE = new Date(2023, 7, 5, 16)
        const FIRST_SUBSCRIPTION_CANCELLATIOIN_DATE = new Date(2023, 7, 4, 17)
        const SECOND_SUBSCRIPTION_CANCELLATIOIN_DATE = new Date(2023, 7, 7, 16)
        var firstSubscriptionResult: CreateSubscriptionResponse
        var secondSubscriptionResult: CreateSubscriptionResponse
        const CUSTOMER_ID = new CustomerId()
        let customer: Customer
        const CUSTOMER_PAYMENT_METHOD = new PaymentMethod("visa", "4342", 11, 2040, "233", true, "")


        beforeAll(async () => {
            customer = Customer.create(
                CUSTOMER_EMAIL,
                true,
                "",
                [],
                0,
                new Date(),
                undefined,
                undefined,
                CUSTOMER_PASSWORD,
                "active",
                undefined,
                undefined,
                CUSTOMER_ID
            )
            await mockCustomerRepository.save(customer)


            const createSubscriptionDto: CreateSubscriptionDto = {
                customerId: CUSTOMER_ID.toString(),
                planId: planVegetariano.id.toString(),
                planVariantId: planVegetarianoVariant2Persons2Recipes.id.toString(),
                planFrequency: "weekly",
                restrictionComment: "string",
                stripePaymentMethodId: "",
                couponId: undefined,
                paymentMethodId: "string",
                addressName: CUSTOMER_ADDRESS_NAME,
                addressDetails: CUSTOMER_ADDRESS_DETAILS,
                latitude: CUSTOMER_LATITUDE,
                longitude: CUSTOMER_LONGITUDE,
                customerFirstName: CUSTOMER_FIRST_NAME,
                customerLastName: CUSTOMER_LAST_NAME,
                phone1: CUSTOMER_PHONE,
                locale: Locale.es,
                shippingCity: "Alboraya",
                shippingProvince: "Valencia",
                shippingPostalCode: "46120",
                shippingCountry: "España",
                purchaseDate: FIRST_SUBSCRIPTION_PURCHASE_DATE
            }
            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)


            customer.addPaymentMethod(CUSTOMER_PAYMENT_METHOD)
        })

        describe("When the customer cancels the first subscription", () => {
            beforeAll(async () => {
                await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: firstSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: FIRST_SUBSCRIPTION_CANCELLATIOIN_DATE })

            })

            it("It should leave the first subscription in SUBSCRIPTION_CANCELLED state", () => {
                expect(firstSubscriptionResult.subscription.isCancelled()).toBeTruthy()
            })


            it("Should leave the first subscription billed orders in BILLED state", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)

                expect(orders.filter(order => order.state.isBilled()).length).toBe(1)// TO DO: Change
            })

            it("Should leave the first subscription related orders in CANCELLED state", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)

                expect(orders.filter(order => order.isCancelled()).length).toBe(11) // TODO: Change
            })


            it("Should leave future payment orders in CANCELLED state", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders.filter(paymentOrder => paymentOrder.isCancelled()).length).toBe(11) // TO DO: Change
            })
        })

        describe("When the customer cancels the second subscription", () => {
            beforeAll(async () => {
                const createSecondSubscriptionDto: CreateSubscriptionAsAdminDto = {
                    customerId: CUSTOMER_ID.toString(),
                    planId: gourmetPlan.id.toString(),
                    planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
                    planFrequency: "weekly",
                    locale: Locale.es,
                    purchaseDate: SECOND_SUBSCRIPTION_PURCHASE_DATE,
                    couponCode: "",
                    useWalletAsPaymentMethod: false
                }

                //@ts-ignore
                mockPaymentService.paymentIntent.mockImplementationOnce(async (): Promise<PaymentIntent> => ({
                    status: "succeeded",
                    client_secret: "client_secret",
                    id: "payment_intent_id",
                    amount: 0
                }))

                secondSubscriptionResult = await createSubscriptionAsAdminUseCase.execute(createSecondSubscriptionDto)
                await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: secondSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: SECOND_SUBSCRIPTION_CANCELLATIOIN_DATE })
            })

            it("It should leave the first subscription in SUBSCRIPTION_CANCELLED state", () => {
                expect(firstSubscriptionResult.subscription.isCancelled()).toBeTruthy()
            })

            it("It should leave the second subscription in SUBSCRIPTION_CANCELLED state", () => {
                expect(secondSubscriptionResult.subscription.isCancelled()).toBeTruthy()
            })

            it("Should leave the first subscription billed orders in BILLED state", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)

                expect(orders.filter(order => order.state.isBilled()).length).toBe(1)// TO DO: Change
            })

            it("Should leave the first subscription related orders in CANCELLED state", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)
                const billedOrders = orders.filter(order => order.isBilled())
                expect(orders.filter(order => order.isCancelled()).length).toBe(orders.length - billedOrders.length)
            })

            it("Should leave all the future customer orders in CANCELLED state", async () => {
                const orders: Order[] = await mockOrderRepository.findAllBySubscriptionId(firstSubscriptionResult.subscription.id)

                expect(orders.filter(order => order.isCancelled()).length).toBe(11) // TO DO: Change
            })

            it("Should not leave not even one payment order in ACTIVE", async () => {
                const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

                expect(paymentOrders.filter(paymentOrder => paymentOrder.isActive()).length).toBe(0) // TO DO: Change
            })


        })
    })

    describe("The beautiful bug of cancelled active subscriptions", () => {
        const FIRST_SUBSCRIPTION_PURCHASE_DATE = new Date(2022, 10, 4, 17)
        const SECOND_SUBSCRIPTION_PURCHASE_DATE = new Date(2023, 7, 5, 16)
        const FIRST_SUBSCRIPTION_CANCELLATIOIN_DATE = new Date(2023, 7, 4, 17)
        const SECOND_SUBSCRIPTION_CANCELLATIOIN_DATE = new Date(2023, 7, 7, 16)
        var firstSubscriptionResult: CreateSubscriptionResponse
        var secondSubscriptionResult: CreateSubscriptionResponse
        const CUSTOMER_ID = new CustomerId()
        let customer: Customer
        const CUSTOMER_PAYMENT_METHOD = new PaymentMethod("visa", "4342", 11, 2040, "233", true, "")

        beforeAll(async () => {
            customer = Customer.create(
                CUSTOMER_EMAIL,
                true,
                "",
                [],
                0,
                new Date(),
                undefined,
                undefined,
                CUSTOMER_PASSWORD,
                "active",
                undefined,
                undefined,
                CUSTOMER_ID
            )
            await mockCustomerRepository.save(customer)


            let createSubscriptionDto: CreateSubscriptionDto = {
                customerId: CUSTOMER_ID.toString(),
                planId: planVegetariano.id.toString(),
                planVariantId: planVegetarianoVariant2Persons2Recipes.id.toString(),
                planFrequency: "weekly",
                restrictionComment: "string",
                stripePaymentMethodId: "",
                couponId: undefined,
                paymentMethodId: "string",
                addressName: CUSTOMER_ADDRESS_NAME,
                addressDetails: CUSTOMER_ADDRESS_DETAILS,
                latitude: CUSTOMER_LATITUDE,
                longitude: CUSTOMER_LONGITUDE,
                customerFirstName: CUSTOMER_FIRST_NAME,
                customerLastName: CUSTOMER_LAST_NAME,
                phone1: CUSTOMER_PHONE,
                locale: Locale.es,
                shippingCity: "Alboraya",
                shippingProvince: "Valencia",
                shippingPostalCode: "46120",
                shippingCountry: "España",
                purchaseDate: new Date(2022, 5, 29, 10, 5)
            }

            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: firstSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: new Date(2022, 5, 29, 10, 20) })

            createSubscriptionDto = {
                ...createSubscriptionDto,
                planId: gourmetPlan.id.toString(),
                planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
                purchaseDate: new Date(2022, 6, 9, 10, 25)
            }

            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: firstSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: new Date(2022, 6, 15, 10, 30) })

            createSubscriptionDto = {
                ...createSubscriptionDto,
                purchaseDate: new Date(2022, 6, 18, 10, 35)
            }
            customer.addPaymentMethod(CUSTOMER_PAYMENT_METHOD)


            //@ts-ignore
            mockPaymentService.paymentIntent.mockImplementationOnce(async (): Promise<PaymentIntent> => ({
                status: "succeeded",
                client_secret: "client_secret",
                id: "payment_intent_id",
                amount: 0
            }))

            firstSubscriptionResult = await createSubscriptionAsAdminUseCase.execute({
                couponCode: "",
                customerId: CUSTOMER_ID.toString(),
                locale: Locale.es,
                planFrequency: "weekly",
                planId: planVegetariano.id.toString(),
                planVariantId: planVegetarianoVariant2Persons2Recipes.id.toString(),
                purchaseDate: new Date(2022, 6, 18, 10, 35),
                useWalletAsPaymentMethod: false
            })

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: firstSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: new Date(2022, 6, 21, 10, 40) })

            createSubscriptionDto = {
                ...createSubscriptionDto,
                planId: planVegetariano.id.toString(),
                planVariantId: planVegetarianoVariant2Persons2Recipes.id.toString(),
                purchaseDate: new Date(2022, 6, 22, 10, 45)
            }

            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

            // Swap de variante 32 a 42
            // Swap de variante de Admin de 42 a 32

            await payAllSubscriptions.execute({ executionDate: new Date(2022, 6, 23, 3, 50) })

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: firstSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: new Date(2022, 6, 26, 10, 50) })

            createSubscriptionDto = {
                ...createSubscriptionDto,
                planVariantId: planVegetarianoVariant2Persons4Recipes.id.toString(),
                purchaseDate: new Date(2022, 6, 29, 10, 55)
            }

            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

            await payAllSubscriptions.execute({ executionDate: new Date(2022, 6, 30, 3, 0) })
            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: firstSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: new Date(2022, 7, 4, 11) })

            createSubscriptionDto = {
                ...createSubscriptionDto,
                planId: gourmetPlan.id.toString(),
                planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
                purchaseDate: new Date(2022, 7, 5, 11, 5)
            }

            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

            await payAllSubscriptions.execute({ executionDate: new Date(2022, 7, 9, 3, 10) })

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: firstSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: new Date(2022, 7, 10, 11, 10) })

            createSubscriptionDto = {
                ...createSubscriptionDto,
                planId: planVegetariano.id.toString(),
                planVariantId: planVegetarianoVariant2Persons2Recipes.id.toString(),
                purchaseDate: new Date(2022, 7, 12, 11, 15)
            }

            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

            await payAllSubscriptions.execute({ executionDate: new Date(2022, 7, 13, 3, 20) })
            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: firstSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: new Date(2022, 7, 17, 11, 20) })

            createSubscriptionDto = {
                ...createSubscriptionDto,
                planId: gourmetPlan.id.toString(),
                planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
                purchaseDate: new Date(2022, 7, 19, 11, 25)
            }

            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

            await payAllSubscriptions.execute({ executionDate: new Date(2022, 7, 20, 3, 30) })
            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: firstSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: new Date(2022, 7, 24, 11, 30) })

            createSubscriptionDto = {
                ...createSubscriptionDto,
                planId: planVegetariano.id.toString(),
                planVariantId: planVegetarianoVariant2Persons2Recipes.id.toString(),
                purchaseDate: new Date(2022, 7, 26, 11, 35)
            }

            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

            await payAllSubscriptions.execute({ executionDate: new Date(2022, 7, 27, 3, 40) })
            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: firstSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: new Date(2022, 7, 29, 11, 40) })

            createSubscriptionDto = {
                ...createSubscriptionDto,
                planId: gourmetPlan.id.toString(),
                planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
                purchaseDate: new Date(2022, 9, 7, 11, 45)
            }

            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

            await payAllSubscriptions.execute({ executionDate: new Date(2022, 9, 8, 3, 50) })
            await payAllSubscriptions.execute({ executionDate: new Date(2022, 9, 15, 3, 50) })

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: firstSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: new Date(2022, 9, 20, 12) })

            createSubscriptionDto = {
                ...createSubscriptionDto,
                planId: planVegetariano.id.toString(),
                planVariantId: planVegetarianoVariant2Persons2Recipes.id.toString(),
                purchaseDate: new Date(2022, 9, 20, 17, 5)
            }

            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

            // SWAP DE PLAN completo

            await payAllSubscriptions.execute({ executionDate: new Date(2022, 9, 22, 4, 10) })
            await payAllSubscriptions.execute({ executionDate: new Date(2022, 9, 29, 4, 10) })
            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", subscriptionId: firstSubscriptionResult.subscription.id.toString(), nameOrEmailOfAdminExecutingRequest: "", queryDate: new Date(2022, 10, 4, 16) })
            //

            createSubscriptionDto = { ...createSubscriptionDto, purchaseDate: FIRST_SUBSCRIPTION_PURCHASE_DATE }
            firstSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

            arepasDeCrhistian.availableWeeks = [...arepasDeCrhistian.availableWeeks, firstSubscriptionResult.firstOrder.week]
            rissotoDeBoniato.availableWeeks = [...rissotoDeBoniato.availableWeeks, firstSubscriptionResult.firstOrder.week]

            await chooseRecipesForOrderUseCase.execute({
                isAdminChoosing: false,
                orderId: firstSubscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 1, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }, { quantity: 1, recipeId: rissotoDeBoniato.id.toString(), recipeVariantId: rissotoDeBoniato.recipeVariants[0].id.toString() }],
                choosingDate: FIRST_SUBSCRIPTION_PURCHASE_DATE,
                isInCheckout: false
            })

            await chooseRecipesForOrderUseCase.execute({
                isAdminChoosing: false,
                orderId: firstSubscriptionResult.firstOrder.id.toString(),
                recipeSelection: [{ quantity: 2, recipeId: arepasDeCrhistian.id.toString(), recipeVariantId: arepasDeCrhistian.recipeVariants[0].id.toString() }],
                choosingDate: FIRST_SUBSCRIPTION_PURCHASE_DATE,
                isInCheckout: false
            })

            await payAllSubscriptions.execute({ executionDate: new Date(2022, 10, 5, 17) })
            await payAllSubscriptions.execute({ executionDate: new Date(2022, 10, 12, 17) })
            await payAllSubscriptions.execute({ executionDate: new Date(2022, 10, 19, 17) })

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", queryDate: new Date(2022, 10, 25, 17), subscriptionId: firstSubscriptionResult.subscription.id.toString() })

            createSubscriptionDto = {
                ...createSubscriptionDto,
                purchaseDate: new Date(2023, 4, 5, 17)
            }

            secondSubscriptionResult = await createSubscriptionUseCase.execute(createSubscriptionDto)

            await payAllSubscriptions.execute({ executionDate: new Date(2023, 4, 6, 17) })
            await payAllSubscriptions.execute({ executionDate: new Date(2023, 4, 13, 17) })

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", queryDate: new Date(2023, 4, 15, 17), subscriptionId: secondSubscriptionResult.subscription.id.toString() })

            const thirdSubscriptionResult = await createSubscriptionUseCase.execute({
                ...createSubscriptionDto,
                purchaseDate: new Date(2023, 5, 16, 17)
            })

            await payAllSubscriptions.execute({ executionDate: new Date(2023, 5, 17, 17) })

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", queryDate: new Date(2023, 5, 19, 17), subscriptionId: thirdSubscriptionResult.subscription.id.toString() })


            const fourthSubscriptionResult = await createSubscriptionUseCase.execute({
                ...createSubscriptionDto,
                purchaseDate: new Date(2023, 5, 29, 17)
            })

            await payAllSubscriptions.execute({ executionDate: new Date(2023, 6, 1, 17) })

            await payAllSubscriptions.execute({ executionDate: new Date(2023, 6, 8, 17) })

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", queryDate: new Date(2023, 6, 5, 17), subscriptionId: fourthSubscriptionResult.subscription.id.toString() })

            const fifthSubscriptionResult = await createSubscriptionUseCase.execute({
                ...createSubscriptionDto,
                purchaseDate: new Date(2023, 6, 8, 17)
            })

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", queryDate: new Date(2023, 6, 13, 17), subscriptionId: fifthSubscriptionResult.subscription.id.toString() })

            const sixthSubscriptionResult = await createSubscriptionUseCase.execute({
                ...createSubscriptionDto,
                purchaseDate: new Date(2023, 6, 14, 17)
            })

            await payAllSubscriptions.execute({ executionDate: new Date(2023, 6, 19, 3) })

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", queryDate: new Date(2023, 6, 19, 9), subscriptionId: sixthSubscriptionResult.subscription.id.toString() })

            await payAllSubscriptions.execute({ executionDate: new Date(2023, 6, 29, 3) })

            const seventhSubscriptionResult = await createSubscriptionUseCase.execute({
                ...createSubscriptionDto,
                purchaseDate: new Date(2023, 6, 29, 17)
            })

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", queryDate: new Date(2023, 7, 4, 9), subscriptionId: seventhSubscriptionResult.subscription.id.toString() })

            await payAllSubscriptions.execute({ executionDate: new Date(2023, 7, 5, 3) })

            //@ts-ignore
            mockPaymentService.paymentIntent.mockImplementationOnce(async (): Promise<PaymentIntent> => ({
                status: "succeeded",
                client_secret: "client_secret",
                id: "payment_intent_id",
                amount: 0
            }))

            const eightSubscriptionResult = await createSubscriptionAsAdminUseCase.execute({
                customerId: CUSTOMER_ID.toString(),
                planId: gourmetPlan.id.toString(),
                planVariantId: planGourmetVariant2Persons2Recipes.id.toString(),
                planFrequency: "weekly",
                locale: Locale.es,
                purchaseDate: new Date(2023, 7, 5, 10),
                couponCode: "",
                useWalletAsPaymentMethod: false
            })

            await cancelASubscriptionUseCase.execute({ cancellationComment: "", cancellationReason: "", queryDate: new Date(2023, 7, 7, 9), subscriptionId: eightSubscriptionResult.subscription.id.toString() })
        })

        it("Should not have any active payment order", async () => {
            const paymentOrders: PaymentOrder[] = await mockPaymentOrderRepository.findByCustomerId(CUSTOMER_ID)

            expect(paymentOrders.filter(paymentOrder => paymentOrder.isActive()).length).toBe(0)
        })
    })
})